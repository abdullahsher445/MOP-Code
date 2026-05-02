// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   ImagePlus,
//   Save,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   ListOrdered,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
// } from "lucide-react";

// export default function BlogForm({ initialData, onSubmit }: any) {
//   const [form, setForm] = useState(
//     initialData || {
//       title: "",
//       subTitle: "",
//       date: "",
//       description: "",
//       imageOne: "",
//       imageTwo: "",
//       imageThree: "",
//     }
//   );

//   const [previews, setPreviews] = useState<any>({
//     imageOne: form.imageOne || "",
//     imageTwo: form.imageTwo || "",
//     imageThree: form.imageThree || "",
//   });

//   const [errors, setErrors] = useState<any>({});

//   const imageOneRef = useRef<HTMLInputElement>(null);
//   const imageTwoRef = useRef<HTMLInputElement>(null);
//   const imageThreeRef = useRef<HTMLInputElement>(null);
//   const editorRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (editorRef.current && form.description) {
//       editorRef.current.innerHTML = form.description;
//     }
//   }, []);

//   const handleImage = (file: File, fieldName: string) => {
//     if (!file.type.startsWith("image/")) {
//       setErrors((prev: any) => ({
//         ...prev,
//         [fieldName]: "Only image files are allowed",
//       }));
//       return;
//     }

//     const imageUrl = URL.createObjectURL(file);

//     setPreviews((prev: any) => ({
//       ...prev,
//       [fieldName]: imageUrl,
//     }));

//     setForm((prev: any) => ({
//       ...prev,
//       [fieldName]: file,
//     }));

//     setErrors((prev: any) => ({
//       ...prev,
//       [fieldName]: "",
//     }));
//   };

//   const handleDrop = (e: any, fieldName: string) => {
//     e.preventDefault();

//     if (e.dataTransfer.files?.[0]) {
//       handleImage(e.dataTransfer.files[0], fieldName);
//     }
//   };

//   const handleEditorChange = () => {
//     const htmlContent = editorRef.current?.innerHTML || "";

//     setForm({
//       ...form,
//       description: htmlContent,
//     });

//     setErrors((prev: any) => ({
//       ...prev,
//       description: "",
//     }));
//   };

//   const formatText = (command: string, value?: string) => {
//     document.execCommand(command, false, value);
//     handleEditorChange();
//     editorRef.current?.focus();
//   };

//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!form.title.trim()) {
//       newErrors.title = "Title is required";
//     }

//     if (!form.subTitle.trim()) {
//       newErrors.subTitle = "Sub title is required";
//     }

//     if (!form.date) {
//       newErrors.date = "Date is required";
//     }

//     const plainText = editorRef.current?.innerText.trim() || "";

//     if (!plainText) {
//       newErrors.description = "Blog content is required";
//     }

//     if (!form.imageOne) {
//       newErrors.imageOne = "First image is required";
//     }

//     if (!form.imageTwo) {
//       newErrors.imageTwo = "Second image is required";
//     }

//     if (!form.imageThree) {
//       newErrors.imageThree = "Third image is required";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();

//     handleEditorChange();

//     if (!validateForm()) {
//       return;
//     }

//     onSubmit(form);
//   };

//   const ImageUploadBox = ({
//     label,
//     fieldName,
//     inputRef,
//   }: {
//     label: string;
//     fieldName: string;
//     inputRef: React.RefObject<HTMLInputElement | null>;
//   }) => {
//     return (
//       <div>
//         <label className="mb-3 block text-sm font-medium">{label}</label>

//         <div
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={(e) => handleDrop(e, fieldName)}
//           onClick={() => inputRef.current?.click()}
//           className={`cursor-pointer rounded-2xl border-2 border-dashed bg-[#F8FFFA] p-8 text-center hover:bg-[#F0FFF6] ${
//             errors[fieldName] ? "border-red-500" : "border-[#CFEFD9]"
//           }`}
//         >
//           {!previews[fieldName] ? (
//             <>
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50]">
//                 <ImagePlus size={22} />
//               </div>
//               <p className="mt-3 text-sm font-semibold">Upload image</p>
//               <p className="text-sm text-[#687280]">
//                 Drag & drop or click to browse
//               </p>
//             </>
//           ) : (
//             <img
//               src={previews[fieldName]}
//               alt="preview"
//               className="mx-auto h-40 rounded-lg object-cover"
//             />
//           )}
//         </div>

//         <input
//           type="file"
//           ref={inputRef}
//           className="hidden"
//           accept="image/*"
//           onChange={(e) =>
//             e.target.files && handleImage(e.target.files[0], fieldName)
//           }
//         />

//         {errors[fieldName] && (
//           <p className="mt-1 text-sm text-red-500">{errors[fieldName]}</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Enter Title */}
//       <div>
//         <label className="mb-2 block text-sm font-medium">Enter Title</label>
//         <input
//           type="text"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           placeholder="Enter title"
//           className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
//             errors.title ? "border-red-500" : "border-[#E5E7EB]"
//           }`}
//         />
//         {errors.title && (
//           <p className="mt-1 text-sm text-red-500">{errors.title}</p>
//         )}
//       </div>

//       {/* Enter Sub Title */}
//       <div>
//         <label className="mb-2 block text-sm font-medium">
//           Enter Sub Title
//         </label>
//         <input
//           type="text"
//           value={form.subTitle}
//           onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
//           placeholder="Enter sub title"
//           className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
//             errors.subTitle ? "border-red-500" : "border-[#E5E7EB]"
//           }`}
//         />
//         {errors.subTitle && (
//           <p className="mt-1 text-sm text-red-500">{errors.subTitle}</p>
//         )}
//       </div>

//       {/* Select Date */}
//       <div>
//         <label className="mb-2 block text-sm font-medium">Select Date</label>
//         <input
//           type="date"
//           value={form.date}
//           onChange={(e) => setForm({ ...form, date: e.target.value })}
//           className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
//             errors.date ? "border-red-500" : "border-[#E5E7EB]"
//           }`}
//         />
//         {errors.date && (
//           <p className="mt-1 text-sm text-red-500">{errors.date}</p>
//         )}
//       </div>

//       {/* Blog Content Editor */}
//       <div>
//         <label className="mb-2 block text-sm font-medium">Blog Content</label>

//         <div
//           className={`overflow-hidden rounded-xl border bg-white ${
//             errors.description ? "border-red-500" : "border-[#E5E7EB]"
//           }`}
//         >
//           {/* Toolbar */}
//           <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
//             <button
//               type="button"
//               onClick={() => formatText("bold")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <Bold size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("italic")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <Italic size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("underline")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <Underline size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("insertUnorderedList")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <List size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("insertOrderedList")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <ListOrdered size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("justifyLeft")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <AlignLeft size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("justifyCenter")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <AlignCenter size={17} />
//             </button>

//             <button
//               type="button"
//               onClick={() => formatText("justifyRight")}
//               className="rounded-lg p-2 hover:bg-[#EAFBF0]"
//             >
//               <AlignRight size={17} />
//             </button>

//             <select
//               onChange={(e) => formatText("formatBlock", e.target.value)}
//               className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none"
//               defaultValue=""
//             >
//               <option value="" disabled>
//                 Format
//               </option>
//               <option value="p">Paragraph</option>
//               <option value="h1">Heading 1</option>
//               <option value="h2">Heading 2</option>
//               <option value="h3">Heading 3</option>
//             </select>
//           </div>

//           {/* Editor */}
//           <div
//             ref={editorRef}
//             contentEditable
//             onInput={handleEditorChange}
//             className="min-h-[220px] w-full bg-[#F9FAFB] px-4 py-3 outline-none focus:bg-white"
//             data-placeholder="Write blog content here..."
//           />
//         </div>

//         {errors.description && (
//           <p className="mt-1 text-sm text-red-500">{errors.description}</p>
//         )}
//       </div>

//       {/* Images */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//         <ImageUploadBox
//           label="Upload First Image"
//           fieldName="imageOne"
//           inputRef={imageOneRef}
//         />

//         <ImageUploadBox
//           label="Upload Second Image"
//           fieldName="imageTwo"
//           inputRef={imageTwoRef}
//         />

//         <ImageUploadBox
//           label="Upload Third Image"
//           fieldName="imageThree"
//           inputRef={imageThreeRef}
//         />
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         className="flex items-center gap-2 rounded-full bg-[#2DBE6C] px-6 py-3 text-white hover:bg-[#1F8F50]"
//       >
//         <Save size={18} />
//         Save Blog
//       </button>
//     </form>
//   );
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Save } from "lucide-react";

export default function BlogForm({ initialData, onSubmit }: any) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      date: "",
      content: "",
      imageOne: "",
      imageTwo: "",
      imageThree: "",
    }
  );

  const [previews, setPreviews] = useState<any>({
    imageOne: initialData?.imageOne || "",
    imageTwo: initialData?.imageTwo || "",
    imageThree: initialData?.imageThree || "",
  });

  const [errors, setErrors] = useState<any>({});

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditorComponent, setCKEditorComponent] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  const imageOneRef = useRef<HTMLInputElement>(null);
  const imageTwoRef = useRef<HTMLInputElement>(null);
  const imageThreeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadEditor = async () => {
      const ckeditor = await import("@ckeditor/ckeditor5-react");
      const classicEditor = await import("@ckeditor/ckeditor5-build-classic");

      setCKEditorComponent(() => ckeditor.CKEditor);
      setClassicEditor(() => classicEditor.default);
      setEditorLoaded(true);
    };

    loadEditor();
  }, []);

  const handleImage = (file: File, fieldName: string) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev: any) => ({
        ...prev,
        [fieldName]: "Only image files are allowed",
      }));
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreviews((prev: any) => ({
      ...prev,
      [fieldName]: imageUrl,
    }));

    setForm((prev: any) => ({
      ...prev,
      [fieldName]: file,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleDrop = (e: any, fieldName: string) => {
    e.preventDefault();

    if (e.dataTransfer.files?.[0]) {
      handleImage(e.dataTransfer.files[0], fieldName);
    }
  };

  const removeHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!removeHtmlTags(form.content)) {
      newErrors.content = "Content is required";
    }

    if (!form.imageOne) {
      newErrors.imageOne = "First image is required";
    }

    if (!form.imageTwo) {
      newErrors.imageTwo = "Second image is required";
    }

    if (!form.imageThree) {
      newErrors.imageThree = "Third image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(form);
  };

  const ImageUploadBox = ({
    label,
    fieldName,
    inputRef,
  }: {
    label: string;
    fieldName: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => {
    return (
      <div>
        <label className="mb-3 block text-sm font-medium">{label}</label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, fieldName)}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed bg-[#F8FFFA] p-8 text-center hover:bg-[#F0FFF6] ${
            errors[fieldName] ? "border-red-500" : "border-[#CFEFD9]"
          }`}
        >
          {!previews[fieldName] ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAFBF0] text-[#1F8F50]">
                <ImagePlus size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold">Upload image</p>
              <p className="text-sm text-[#687280]">
                Drag & drop or click to browse
              </p>
            </>
          ) : (
            <img
              src={previews[fieldName]}
              alt="preview"
              className="mx-auto h-40 rounded-lg object-cover"
            />
          )}
        </div>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleImage(e.target.files[0], fieldName)
          }
        />

        {errors[fieldName] && (
          <p className="mt-1 text-sm text-red-500">{errors[fieldName]}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Enter Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">Enter Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter title"
          className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
            errors.title ? "border-red-500" : "border-[#E5E7EB]"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Enter Description */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Enter Description
        </label>
        <input
          type="text"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Enter description"
          className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
            errors.description ? "border-red-500" : "border-[#E5E7EB]"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Select Date */}
      <div>
        <label className="mb-2 block text-sm font-medium">Select Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={`w-full rounded-xl border bg-[#F9FAFB] px-4 py-3 outline-none focus:border-[#2DBE6C] focus:bg-white ${
            errors.date ? "border-red-500" : "border-[#E5E7EB]"
          }`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-medium">Content</label>

        <div
          className={`overflow-hidden rounded-xl border bg-white ${
            errors.content ? "border-red-500" : "border-[#E5E7EB]"
          }`}
        >
          {editorLoaded && CKEditorComponent && ClassicEditor ? (
            <CKEditorComponent
              editor={ClassicEditor}
              data={form.content}
              onChange={(event: any, editor: any) => {
                const data = editor.getData();

                setForm((prev: any) => ({
                  ...prev,
                  content: data,
                }));

                setErrors((prev: any) => ({
                  ...prev,
                  content: "",
                }));
              }}
            />
          ) : (
            <div className="rounded-xl bg-[#F9FAFB] px-4 py-3 text-sm text-[#687280]">
              Loading editor...
            </div>
          )}
        </div>

        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content}</p>
        )}
      </div>

      {/* Image Uploads */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ImageUploadBox
          label="Upload First Image"
          fieldName="imageOne"
          inputRef={imageOneRef}
        />

        <ImageUploadBox
          label="Upload Second Image"
          fieldName="imageTwo"
          inputRef={imageTwoRef}
        />

        <ImageUploadBox
          label="Upload Third Image"
          fieldName="imageThree"
          inputRef={imageThreeRef}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="flex items-center gap-2 rounded-full bg-[#2DBE6C] px-6 py-3 text-white hover:bg-[#1F8F50]"
      >
        <Save size={18} />
        Save Blog
      </button>
    </form>
  );
}