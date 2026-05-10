import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import os from "os";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".ipynb")) {
      return NextResponse.json(
        { success: false, message: "Only .ipynb files are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const tmpDir = os.tmpdir();
    const inputName = `notebook-${timestamp}.ipynb`;
    const tmpInput = path.join(tmpDir, inputName);

    fs.writeFileSync(tmpInput, buffer);

    const home = os.homedir();
    const isWindows = process.platform === "win32";
    const extraPaths = isWindows
      ? [
          path.join(home, "anaconda3"),
          path.join(home, "anaconda3", "Scripts"),
          path.join(home, "miniconda3"),
          path.join(home, "miniconda3", "Scripts"),
          "C:\\ProgramData\\anaconda3",
          "C:\\ProgramData\\anaconda3\\Scripts",
          "C:\\ProgramData\\miniconda3",
          "C:\\ProgramData\\miniconda3\\Scripts",
        ]
      : [
          path.join(home, "anaconda3", "bin"),
          path.join(home, "miniconda3", "bin"),
          "/opt/anaconda3/bin",
          "/opt/miniconda3/bin",
          "/usr/local/bin",
        ];

    const execEnv = {
      ...process.env,
      PATH: `${extraPaths.join(isWindows ? ";" : ":")};${process.env.PATH ?? ""}`,
    };

    try {
      await execAsync(
        `jupyter nbconvert "${tmpInput}" --to html --no-input --output-dir "${tmpDir}"`,
        { env: execEnv }
      );
    } catch (convError) {
      fs.unlinkSync(tmpInput);
      console.error("[convert-notebook] nbconvert failed:", convError);
      return NextResponse.json(
        {
          success: false,
          message:
            "Notebook conversion failed. Ensure jupyter is installed on the server.",
        },
        { status: 500 }
      );
    }

    const outputName = inputName.replace(".ipynb", ".html");
    const tmpOutput = path.join(tmpDir, outputName);
    const html = fs.readFileSync(tmpOutput, "utf-8");

    fs.unlinkSync(tmpInput);
    fs.unlinkSync(tmpOutput);

    return NextResponse.json({ success: true, html });
  } catch (error) {
    console.error("[convert-notebook] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
