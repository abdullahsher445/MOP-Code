# Urban Pedestrian Climate Impact Prediction

**Authored by:** Maverick Nguyen

**Duration:** 90 mins 

**Level:** Intermediate

**Pre-requisite Skills:** Python, Data Cleaning, Data Visualisation, Time-Series Analysis, Feature Engineering, Optimisation Methods, Deep Learning

**Scenario**

As a local living near Melbourne CBD, Maverick relies on active travel, like walking, and public transport, like trams, to get around to different places he wants to go. One morning in January, Maverick prepared to travel to his workplace, expecting to get to work before 9:00 AM, but there was a sudden heatwave, causing the tram that he usually catches to be unable to follow its designated schedule and creating a delay in his schedule. Although there was a replacement bus for this emergency, only a limited number of people could board this vehicle, which further delayed his schedule. Because of this sudden extreme weather, travel conditions become less reliable and difficult to predict.

Maverick wants to have access to a system that could predict how climate conditions over time can affect urban pedestrian movement. So that he could better plan his trip, allowing him to leave earlier in anticipation of sudden extreme weather change during a particular timeframe, or choose a different mode of transport, like an Uber. This allows more support in making informed decisions when travelling during extreme weather events.

**What this use case will teach you**

At the end of this use case you will:
- Learn how to source and combine multiple public datasets.  
- Understand how to clean and align time-series data at an hourly level for modelling. 
- Explore how climate variables, such as temperature, humidity, pressure, and wind, relate to pedestrian counts.
- Apply feature engineering techniques to create meaningful predictors from weather and mobility time-series data. 
- Build a deep learning forecasting model to predict pedestrian demand. 
- Perform model optimisation like hyperparameter tuning to improve forecasting performance. 
- Evaluate model performance and interpret results for climate adaptation planning.

**Introduction**

Urban systems are often affected by changing climate conditions, but these effects are not always easy to capture with simple forecasting methods. One clear example is pedestrian movement, where changing weather conditions can affect how many people move through the city over time.

This use case focuses on predicting pedestrian activity in the City of Melbourne using hourly climate observations, which keeps the project closely aligned with the goal of modelling how climate factors influence an urban system.

In this use case, pedestrian counts are aggregated into hourly city-level totals and merged with hourly microclimate observations for Melbourne. A deep learning model can then be trained to predict pedestrian demand based on time, recent demand history, and recent climate conditions.

The datasets used in this project are the "Pedestrian Counting System (counts per hour)", the "Pedestrian Counting System - Sensor Locations" dataset for supporting location metadata, and the "Microclimate Sensor Readings" dataset from the City of Melbourne website.

## 1. Importing The Libraries

This section is to show what libraries were used for this use case, with each imported library supporting a specific part of the pipeline. These libraries are necessary for doing data handling, time-series analysis, visualisation, feature engineering, optimisation, and deep learning <a href="#fn-1">[1]</a> <a href="#fn-2">[2]</a> <a href="#fn-3">[3]</a> <a href="#fn-4">[4]</a> <a href="#fn-5">[5]</a>. These were added at the beginning to ensure the workflow is organised <a href="#fn-6">[6]</a>. A random seed was set with a student ID to allow reproducibility of the outputs in this notebook <a href="#fn-7">[7]</a>.

## 2. Importing The Datasets

This section is necessary for importing multiple public datasets from the City of Melbourne, before any cleaning, merging and modelling in later stages can happen. These datasets will be accessed through the City of Melbourne Open Data API v2.1, to allow the notebook to be directly used upon download <a href="#fn-8">[8]</a>.

By using a shared BASE_URL and a dictionary of dataset identifiers, this allows for removing and adding datasets more easily <a href="#fn-8">[8]</a> <a href="#fn-9">[9]</a> <a href="#fn-10">[10]</a> <a href="#fn-11">[11]</a>. The get_csv_url() function is especially useful because it standardises the dataset access method and allows the same logic to be reused across all three datasets <a href="#fn-8">[8]</a>. The ROW_LIMIT parameter was added to allow experimentation on smaller samples before scaling to the full dataset <a href="#fn-8">[8]</a>. Lastly, the datasets are accessed through the Melbourne Open Data API v2.1, and no visible API key is exposed in the code <a href="#fn-8">[8]</a>.

### 2.1 Pedestrian Counting System - Sensor Locations

This dataset was included to provide contextual information about the physical pedestrian counting network, even though it wasn't used in the later steps for modelling. The sensor metadata helps explain where the mobility data originates from and what the coverage of the system looks like <a href="#fn-9">[9]</a>.

* `location_id`: unique identifier for each pedestrian counting location.
* `sensor_description`: human-readable description of the site, like street names.
* `sensor_name`: short internal sensor code.
* `installation_date`: date the sensor was installed.
* `note`: extra comments or metadata about the sensor.
* `location_type`: type of location.
* `status`: operational status of the sensor.
* `direction_1` and `direction_2`: the two movement directions captured by the counter.
* `latitude` and `longitude`: geographic coordinates of the sensor.
* `location`: combined coordinate string.

### 2.2 Pedestrian Counting System (counts per hour)

This is the target dataset for the use case because the final prediction task is to forecast pedestrian demand. The pedestrian dataset contains the observed mobility outcome that the model aims to learn <a href="#fn-10">[10]</a>.

* `id`: record identifier.
* `location_id`: identifier linking the observation to a specific sensor location.
* `sensing_date`: date of observation.
* `hourday`: hour of day from 0 to 23.
* `direction_1` and `direction_2`: directional pedestrian counts.
* `pedestriancount`: total pedestrian count for that record.
* `sensor_name`: short sensor code.
* `location`: coordinate string for the sensor. 

### 2.3 Microclimate sensors data

This dataset provides the microclimate data that the use case requires to understand how climate conditions affect urban pedestrian movement, more specifically, the input features. It basically provides the explanatory environmental variables to connect weather conditions to mobility demand <a href="#fn-11">[11]</a>.

* `device_id`: identifier for each microclimate device.
* `received_at`: timestamp when the reading was recorded.
* `sensorlocation`: descriptive location of the microclimate sensor.
* `latlong`: coordinate string.
* `minimumwinddirection`, `averagewinddirection`, `maximumwinddirection`: wind direction measurements.
* `minimumwindspeed`, `averagewindspeed`, `gustwindspeed`: wind speed measurements.
* `airtemperature`: air temperature reading.
* `relativehumidity`: humidity level.
* `atmosphericpressure`: atmospheric pressure.
* `pm25` and `pm10`: particulate matter measurements.
* `noise`: noise level. 

## 3. Initial Inspection Of The Datasets

This section is necessary to understand the size, structure, completeness and formatting of public datasets since they often differ. Public datasets can have different structures, missing values, data types, date formats, and identifier systems, so checking them early helps identify potential issues in the workflow <a href="#fn-12">[12]</a>. Before trying to clean and merge the datasets, understanding what each of the datasets contains and how they can be combined is important <a href="#fn-12">[12]</a>.

### 3.1 Checking Number Of Rows/Columns

Checking the shape is important because it shows the scale and complexity of each dataset. This helps determine memory demands, cleaning strategy, and whether the data volume is sufficient for later modelling <a href="#fn-13">[13]</a>.

From these results, the pedestrian and microclimate datasets are large enough for later time-series modelling. The sensor locations dataset is much smaller because it only contains metadata about the sensor network, rather than repeated hourly observations. The volume for each task varies, but from the inspection of the shapes, there appears to be sufficient volume for the task of predicting the pedestrian count.

### 3.2 Checking The Features

This step is to verify what information is actually available in each dataset, and whether there are meaningful fields for later joining, cleaning, and modelling. Knowing the columns early prevents accidentally removing important variables or keeping irrelevant variables <a href="#fn-14">[14]</a>.

From the output, the column names confirm that location_id is shared between the sensor metadata and pedestrian counts datasets. Also, the pedestrian and microclimate datasets both contain time information, which is essential because the final merge is ultimately done at the hourly level. The microclimate dataset clearly offers a diverse range of explanatory variables, which is useful for modelling. And, some columns that are likely less useful for the final model need to be removed, such as descriptive notes, raw coordinate strings, and duplicate directional fields.

### 3.3 Checking The Datatypes

Datatype checking is essential because many later operations depend on correct types to proceed. Steps like date parsing, numeric aggregation, interpolation, rolling windows, and model preparation can all fail or behave incorrectly if types are wrong <a href="#fn-15">[15]</a>.

From the outputs, the pedestrian sensing_date, sensor installation_date, and microclimate received_at fields are all initially stored as objects, so they are not yet ready for time-series operations, which will need to be dealt with. And the numeric climate variables are already in float64, and pedestrian counts are in int64, which is appropriate for aggregation and modelling, so no need to change that.

### 3.4 Checking The Dataset Information

Using .info() gives a more complete structural summary of the datasets, which shows non-null counts, memory usage, and dtype balance. But this step will focus more on the memory that will be used up in the RAM, to decide what sample size would be ideal for experimentation before scaling to the full dataset size, or opt for a platform like Google Colab to handle more heavy usage <a href="#fn-16">[16]</a>.

From the outputs, the pedestrian dataset takes up the most memory, followed by the microclimate dataset, with the sensor locations dataset being extremely low. Which is acceptable to run locally for modelling.

### 3.5 Checking For Missing Values

Checking for missing values is important, since it affects the cleaning strategy, feature selection, and merge quality. This is especially important because missing sensor readings can break hourly continuity for the modelling later <a href="#fn-17">[17]</a>.

From the outputs, the pedestrian counts dataset has no missing values at all. The microclimate dataset has many missing values in all the variables besides device_id and received_at. And the sensor locations dataset has some missing values, mainly in note, direction_1, and direction_2, which are not necessary for city-level forecasting.

### 3.6 Checking Summary Statistics

Checking the summary statistics is an easy way to provide some early insights into the datasets, like central tendency and spread <a href="#fn-18">[18]</a>.

From the sensor coordinates with the mean latitude and longitude, the Melbourne CBD can be inferred to be the main area of focus for the datasets. The pedestrian counts are strongly right-skewed, with the median count being a fair bit lower than the mean, and the maximum being really high, which suggests that some hours and sites are much busier than others. The average microclimate temperature is about 16°C, and the average relative humidity is about 66%, which looks plausible for Melbourne across a long time range.

### 3.7 Checking The Date Format

Checking the date format is important because a time-based merge depends on all datasets sharing a compatible datetime structure, and public datasets often use different date formats and timezone conventions. This is important because any mismatch in date or time formatting can prevent the datasets from merging correctly later <a href="#fn-19">[19]</a>.

The pedestrian dataset stores dates and hours separately. Whereas the microclimate dataset stores the full timestamps with date and time with UTC offsets. And the sensor installation date is a simple date string and is mainly historical metadata rather than a modelling field. This makes it clear that datetime standardisation is a required step before any merge can occur.

### 3.8 Checking The ID Columns

This was an additional step for checking the unique identifiers to see if the datasets have any chance of being joined directly by ID or whether another strategy, like a datetime merge, is best. And since the project uses multiple public datasets, checking the unique IDs also helps confirm whether the pedestrian sensors and microclimate sensors use the same location system or separate systems <a href="#fn-20">[20]</a>.

From the outputs, the sensor locations dataset contains 137 unique location_id values, while the pedestrian counts dataset contains 100 unique location_id values. Whereas the microclimate dataset contains 12 unique device_id values, which is a completely different identifier system. This means the microclimate data cannot be joined to pedestrian counts by location ID, so a time-based merge is the best integration method available.

## 4. Data Cleaning

This is the section for data cleaning, since raw data are rarely ready to be used as it is, so cleaning processes are necessary to address duplicates, missing values, inconsistencies, syntax errors, irrelevant data and structural errors <a href="#fn-21">[21]</a> <a href="#fn-22">[22]</a>. And since this data pipeline uses the API for dataset access, this means that the datasets are being updated in real-time, so ensuring any errors get addressed in the pipeline ensures the data remains accurate, secure and accessible at every stage of its lifecycle <a href="#fn-21">[21]</a>. And that the prediction will also be accurate <a href="#fn-22">[22]</a>.

### 4.1 Removing Irrelevant Columns

Selecting relevant variables and removing the irrelevant ones are necessary because not every feature is useful for the prediction modelling. Keeping unnecessary columns can make the workflow harder to manage, increase memory usage, and create confusion in later steps <a href="#fn-23">[23]</a> <a href="#fn-24">[24]</a>.

In this step, the sensor dataset is reduced to six useful metadata columns, even though it wasn't used for modelling purposes. The pedestrian dataset is reduced to the four fields needed to construct hourly counts. The microclimate dataset is reduced to key climate, air quality, and noise variables. The descriptive or duplicate variables were omitted.

### 4.2 Removing Missing Value

This step involves dealing with missing values by removing the rows they're in. This is because missing values in explanatory variables can cause problems when doing aggregation, interpolation, and modelling later, leading to bias results <a href="#fn-25">[25]</a>. This is especially important for the microclimate dataset, since missing climate readings could affect the quality of the explanatory variables.

After doing the column selection in the previous step, the sensor and pedestrian tables are now fully complete without missing values. Whereas the microclimate table still has many missing values, especially in gustwindspeed, pm25, pm10, and noise. 

By using dropna(), the microclimate dataset lost a number of data points with missing values, but still retains a sizable portion of data points. The decision for completeness in the data points was preferred to simplify the merging and feature engineering steps later, and because there were enough data points for it not to matter much.

### 4.3 Datetime Formatting

Ensuring the datetime formatting matches between the different datasets is important because the modelling is hourly, and the datasets need to be able to merge based on a common point for perform chronological analysis across different data sources <a href="#fn-26">[26]</a> <a href="#fn-27">[27]</a>. Skipping this step would mean that the datasets cannot be merged into one table.

The pedestrian dataset is converted from separate sensing_date and hourday fields into a single datetime_hour, such as 2024-12-06 20:00:00. Whereas the microclimate timestamps are converted from UTC into Australia/Melbourne, timezone information is removed, and the values are floored to the nearest hour. By doing this, both datasets now have a datetime variable with the same time formatting. It's also important to note that the time range of the microclimate dataset is narrower than the pedestrian time range, meaning that the overlap period is limited to the microclimate dataset.

### 4.4 Aggregating Values For Hourly Format

This step involves aggregation because the use case models city-level pedestrian demand rather than individual sensor-level behaviour. Since the pedestrian and microclimate datasets both contain multiple records within the same hour. This also ensures that both the pedestrian and the microclimate data share the same hourly rows without duplicates for later merging, reducing the total data volume <a href="#fn-28">[28]</a>.

The aggregation involves the pedestrian counts being summed across sensors to produce hourly city totals, and the microclimate readings are averaged across devices for each hour. Doing this changes the target variable from pedestrians at one site to overall city pedestrian demand at one hour, along with the climate values at that hour. This also further reduces the row counts due to aggregating to hourly, and the microclimate data is still narrower than the pedestrian dataset.

### 4.5 Merging The Datasets

This step will merge the datasets together, ensuring the target variable, pedestrian count, is connected to the explanatory climate variables. The datetime_hour variable on both the pedestrian dataset and the microclimate dataset was inner-joined to merge into one dataset, meaning only the overlapping rows with the same values were merged <a href="#fn-29">[29]</a>. Which means every row has both pedestrian and climate information, hence, a unified format ready for analysis <a href="#fn-30">[30]</a>.

A quick check of the merged dataset shows that the pedestrian counts and climate values aligned in the same hourly observations, which is what the use case is looking for. And there are no missing values, which indicates that previous data cleaning works as intended.

## 5. Data Validation

Doing data validation is important because a merged dataset that was cleaned may still be unsuitable for the task of this use case, possibly due to timestamps being duplicated, out of order, or some rows in the chronological datetime are missing. The time-series model tends to assume a consistent temporal structure with no sudden breaks, so this step in the pipeline checks that everything is complete <a href="#fn-31">[31]</a>.

### 5.1 Validating Time Series Dataset

Checking for duplicates or missing timestamps, since they can affect the lag features, rolling features and any sequence-based deep learning models that this use case may use. This is to ensure that there is a strictly ordered sequence of evenly spaced time points <a href="#fn-32">[32]</a>.

From the outputs, there are no duplicates in the datetime_hour values, which means every timestamp is represented once. The dataset is double-checked to ensure that it is sorted in increasing time order. But there appears to be a number of missing hourly timestamps, which means the dataset is not complete yet. It does appear that random points were cut off, and that no large block of time was cut off.

### 5.2 Fixing Missing Timestamps

Ensuring the missing timestamps are filled in is necessary for a complete hourly sequence in the dataset, and missing them can create issues when performing feature engineering later. Missing hours can cause problems when creating lag features, rolling averages, and LSTM input sequences, since these methods rely on consistent time gaps between rows <a href="#fn-32">[32]</a> <a href="#fn-33">[33]</a>.

This step involves reindexing to the full hourly range so that all the missing timestamps are included in the dataset, and then interpolation is performed to fill in the missing values from those created rows. Hence, the merged dataset now has slightly more rows with no missing hourly stamps, ensuring the timeline is continuous with no breaks. A little addition was included to ensure that the pedestrian counts remained as integers, rather than fractions, due to interpolation. 

## 6. Exploratory Data Analysis

The exploratory data analysis section was performed on the merged dataset to observe any interpretable patterns and get a rough understanding of how the dataset looks and feels before building a model. It's important to get a sense of how pedestrian demand changes over time and how it relates to the climate conditions <a href="#fn-34">[34]</a>.

### 6.1 Pedestrian Count Over Time (Hourly)

Plotting the hourly pedestrian count is for a quick look at the target variable changes over time, to check if the time series data is random or if there are any patterns that may need to be taken into consideration for later steps <a href="#fn-35">[35]</a> <a href="#fn-36">[36]</a>.

From the plot, there appear to be large fluctuations across the full time range with repeated highs and lows. Although it looks random, it does seem to show some sort of pattern, and it's not necessarily random noise, with recurring fluctuations, like the new year of each year seems to always be a high peak, indicating lots of pedestrians travelling in the city, and there also appear to be some sharp dips, which may possibly be public holidays. This does suggest that there may be other possible variables that might have influenced the pedestrian count, but it definitely confirms that pedestrian demand is influenced by recurring temporal and possibly environmental effects.

### 6.2 Average Pedestrian Count By Day Of Week

The day-of-week summary was checked to see if there may also be other variables like work patterns, shopping activities, or weekend behaviours that might have influenced the pedestrian demand. Also checks whether the day of the week should be considered an important time-based feature for later modelling <a href="#fn-35">[35]</a> <a href="#fn-37">[37]</a>.

From the plot, it does seem like the weekdays tend to be relatively high along with Saturdays, whereas Mondays and Sundays tend to have low pedestrian demands. Monday might be low despite being a normal workday for the average Australians might be due to the influence of public holidays, and Sunday being low is due to most people not working on Sunday, since businesses would usually pay a high penalty rate. This further suggests that the CBD pedestrian pattern is linked to weekday economic and commuter activity, not just climate variables.

### 6.3 Distributions Of Variables

Checking for distribution to see whether it's symmetric, skewed, or multi-modal. This is useful because skewed variables, extreme values, or unusual distributions can influence how the model learns from the data <a href="#fn-38">[38]</a>.

* pedestriancount appears unimodal and right-skewed.
* airtemperature appears unimodal with a slight right skew.
* relativehumidity appears unimodal with a slight left skew.
* atmosphericpressure appears unimodal and slightly left-skewed.
* averagewindspeed appears unimodal and right-skewed.
* gustwindspeed appears unimodal and right-skewed.
* averagewinddirection appears roughly unimodal and mostly symmetric.
* pm25 appears unimodal and right-skewed.
* pm10 appears unimodal and right-skewed, similar to pm25.
* noise appears unimodal and fairly symmetric.

### 6.4 Correlation Matrix

Checking the correlation matrix is a quick way to see which climate variables might have the strongest relationship with pedestrian demand, which does seem like they have some influence on the target variable from the results. This is mainly to show whether the relationship is positive or negative, even though correlation does not prove causation <a href="#fn-39">[39]</a>.

- noise has the strongest positive correlation with pedestrian count, followed by gustwindspeed, airtemperature, averagewindspeed, and averagewinddirection. This suggests that pedestrian activity tends to increase when these variables increase.
- relativehumidity has the strongest negative correlation with pedestrian count, while pm10, pm25, and atmosphericpressure have weaker negative relationships. This suggests that pedestrian activity tends to decrease when these variables increase.

This suggests that climate variables do play a role in influencing the pedestrian demand, but there are other influences as well as discovered from previous plots. But the goal for this task is to understand how climate variables affect pedestrian demands.

## 7. Time Series Analysis

This section is necessary as exploratory data analysis alone is not enough to check a time series dataset. Hence, time series analysis is necessary to help uncover more trends, seasonality, repeated lag dependence, and stationarity <a href="#fn-36">[36]</a>.

### 7.1 Pedestrian Count Over Time (24-Hour Rolling Mean)

The previous plot with the pedestrian count over time was noisy, so smoothing over 24 hours may help reveal more patterns of pedestrian activity without the hour-to-hour volatility <a href="#fn-40">[40]</a>.

From the plot, it became much more obvious that the highest peaks were during New Year's, where pedestrian visit the Melbourne CBD to see the fireworks, and confirms what has been previously discussed. There does seem to be a slightly increasing trend, which suggests that the influence of COVID-19 is still recovering.

### 7.2 Seasonal Pattern (24-Hour Cycle)

Seasonal decomposition is necessary because hourly pedestrian demand is expected to have a strong daily cycle, so checking the seasonal component can help check how the typical hour of the day affects pedestrian activity. Since people usually move through the city at different levels during the morning, workday, evening, and late night, this step helps show whether the hour of the day is a factor in pedestrian demand <a href="#fn-41">[41]</a>.

From the plot, it is clear that the seasonal effect is strongly negative at night and becomes strongly positive during the workday, especially the peak at 5 PM, when most people finish work and are looking to go home. The lowest tends to be around 3 AM, which is expected, since people tend to party late until 12 PM before heading home, and the other reason is that the city's pedestrian activities are very limited at that time. This plot further confirms that hour-of-day is a major driver of pedestrian demand, and there may be other variables influencing pedestrian demand.

### 7.3 Autocorrelation Of Pedestrian Count

Checking for autocorrelation is important because it shows whether the current pedestrian demand depends on previous hours, and if strong dependence exists, then lag features will be very useful for forecasting <a href="#fn-42">[42]</a>.

From the plot, there appears to be a very strong repeating pattern at a regular interval, especially around daily cycles. This repeated structure applies not only on the daily level, but also appears to be on the weekly level as well, meaning daily and weekly lag features will be useful for predictions.

### 7.4 Augmented Dickey-Fuller Test

The Augmented Dickey-Fuller Test checks whether the time series is statistically stationary in the unit-root sense, and while not necessary for deep learning modelling, it does provide some more understanding of the patterns underlying the merged dataset <a href="#fn-43">[43]</a>.

The result was that the p-value is extremely small and the test statistic is far below the critical values, hence, the null hypothesis of a unit root is rejected. This means that the time series dataset is statistically stationary enough to exhibit a learnable structure rather than behaving like a random walk, which basically means that it's not necessarily a random coin toss in layman's terms.

## 8. Feature Engineering

The feature engineering section is necessary because the current variables in the merged datasets may not necessarily be enough for a strong forecasting model, so doing feature engineering will create more useful variables that help capture other aspects of the datasets, like cyclical structures, recent history, and short-term trends <a href="#fn-44">[44]</a> <a href="#fn-45">[45]</a>.

### 8.1 Creating Time Features

Creating more calendar-based features is necessary because pedestrian activity depends on when that observation happened, as shown in previous plots. Hence, hours, day of week, month, and weekend status are all useful predictors. This step ensures the datetime_hour column is converted into its individual components <a href="#fn-45">[45]</a>.

The output shows that new time-based columns were added to the dataset. These include hour, day_of_week, month, and is_weekend.

### 8.2 Creating Cyclical Time Features

Cyclical encoding is necessary since time variables are cyclical and not linear, like a clock. If we're talking just normal values like 0 and 23, these two values are quite far apart, but it's not, since it's time and there's only 1 hour difference. Using sine and cosine preserves that circular structure. This step ensures that the time variables are cyclical and prevents the models from learning misleading distances between values at the edge of a cycle <a href="#fn-46">[46]</a>.

The output shows that new cyclical time features were created, including hour_sin, hour_cos, dow_sin, dow_cos, month_sin, and month_cos.

### 8.3 Creating Cyclical Wind Direction Features

Wind direction is also circular, being 360 degrees, meaning 0 and 359 degrees are almost the same direction. So wind direction must also be converted to cyclical for a continuous form, and ensure consistency with treatments of cyclical variables like time <a href="#fn-46">[46]</a>.

The output shows that two new features were created, wind_dir_sin and wind_dir_cos.

### 8.4 Creating Lag Features

Lag features are important, as indicated by the autocorrelation plot, since pedestrian demand is highly dependent on recent history based on the autocorrelation plot <a href="#fn-47">[47]</a> <a href="#fn-48">[48]</a>.

The features lag_1, lag_24, and lag_168 capture the previous hour, previous day, and previous week at the same hour. This does create missing values since there wasn't recent information to populate the lag columns for specific rows, which will be dealt with. Like the very first row having a missing value for lag_1, because there wasn't a previous row to populate that value.

### 8.5 Creating Rolling Features

Rolling features summarise recent pedestrian counts rather than relying on a single observation for a datapoint, allowing the model to capture the short-term trend and help smooth the short-term noise <a href="#fn-47">[47]</a>.

Some new predictors were added, like rolling_mean_24, which summarises the previous 24 hours, while rolling_mean_168 summarises the previous week. And as expected, similar to lag features but not the same, the first rows are missing values since the rolling window cannot be calculated until enough history exists. 

### 8.6 Removing NA Rows

This step removes the rows with missing values created from the lag and rolling features at the beginning of the ordered merged dataset, since they cannot be used as they are incomplete predictor information. By removing these rows, the dataset lost a part of the early period as a trade-off in the pipeline, which is reasonable considering the dataset is being updated in real-time, so there will be more data points to use in the future, hence, negligible <a href="#fn-48">[48]</a>.

The output shows that all rows with missing values were removed, and the dataset was reset into a clean index.

### 8.7 Removing Unnecessary Features

Since the cyclical variables were created, the original raw cyclical variables have become redundant. So removing these variables helps reduce feature duplication and makes the modelling easier and cleaner <a href="#fn-23">[23]</a> <a href="#fn-24">[24]</a>.

The averagewinddirection, hour, day_of_week, and month columns are dropped. Resulting in 24 columns, including the target pedestrian count, selected climate variables, is_weekend, cyclical encodings, lag features, and rolling means. The datetime_hour is temporarily kept, but will be removed later on as well.

## 9. Preparing Train/Val/Test Splits

Preparing the splits is necessary for training a forecasting model, so that the future periods are evaluated, and not on randomly selected time periods. Hence, splitting the dataset based on time is important so that the model being trained on the past can predict the future, like in real-world scenarios <a href="#fn-49">[49]</a>.

### 9.1 Splitting The Data By Time

Chronological splitting in time-series forecasting is to prevent leaking future information into the training process. For example is if random splitting were to be used, then a model can be trained on data points in 2026, but is tested on a time period in 2025. Hence, the validation and test set must be later, and the training set must be the past, as shown here <a href="#fn-49">[49]</a>.

The split for training, validation and testing is 80:10:10 to ensure that there are enough data points used for training, with enough data points to perform validation and testing. Deep learning tends to require a large number of data points, so using this split ratio prevents underfitting <a href="#fn-50">[50]</a>.

The output confirms that the data was split chronologically, with the training data coming first, followed by validation and testing data.

### 9.2 Separating Features And Target

This step is necessary to separate the predictor inputs X and the output target y. This is necessary because the model needs to know which columns are used as inputs and which column it needs to predict <a href="#fn-51">[51]</a>.

The target is set to pedestriancount, which is the variable the model is trying to predict. The datetime column is excluded from the features since the chronological splitting is completed, so this leaves 22 predictor columns for each split, as shown in the shapes output.

### 9.3 Scaling The Features

Scaling the features is necessary because the predictor variables are measured on different scales. For example, temperature, humidity, air pressure, wind speed, pollution values, and lagged pedestrian counts all have different ranges. Hence, needs to be standardised so that the variables are unitless, allowing the variables to be able to directly compared <a href="#fn-52">[52]</a>.

Standardisation basically sets the predictors to have a mean of 0 and a standard deviation of 1. This allows faster convergence when all the input features are on the same scale, preventing feature dominance due to differences in magnitudes, and is generally more stable <a href="#fn-52">[52]</a>.

The output shows that the training, validation, and test feature sets were successfully scaled using StandardScaler.

## References

<fn id="fn-1">[1] pandas development team (2026) _pandas - Python Data Analysis Library_, pandas, Online.</fn>

<fn id="fn-2">[2] pandas development team (2026) _Time series / date functionality_, pandas, Online.</fn>

<fn id="fn-3">[3] Matplotlib Development Team (Unknown date) _Matplotlib: Visualization with Python_, Matplotlib, Online.</fn>

<fn id="fn-4">[4] scikit-learn Developers (Unknown date) _Preprocessing data_, scikit-learn, Online.</fn>

<fn id="fn-5">[5] TensorFlow (2023) _Keras: The high-level API for TensorFlow_, Google, Online.</fn>

<fn id="fn-6">[6] Guido van Rossum, Barry Warsaw and Alyssa Coghlan (2001) _PEP 8 – Style Guide for Python Code_, Python Enhancement Proposals, Online.</fn>

<fn id="fn-7">[7] TensorFlow (2024) _tf.keras.utils.set_random_seed_, Google, Online.</fn>

<fn id="fn-8">[8] Opendatasoft (Unknown date) _Huwise's Explore API Reference Documentation_, Opendatasoft, Online.</fn>

<fn id="fn-9">[9] City of Melbourne (2023) _Pedestrian Counting System - Sensor Locations_, City of Melbourne Open Data Portal, Online.</fn>

<fn id="fn-10">[10] City of Melbourne (2023) _Pedestrian Counting System: Counts per Hour_, City of Melbourne Open Data Portal, Online.</fn>

<fn id="fn-11">[11] City of Melbourne (2023) _Microclimate Sensors Data_, City of Melbourne Open Data Portal, Online.</fn>

<fn id="fn-12">[12] IBM (Unknown date) _What is data profiling?_, IBM, Online.</fn>

<fn id="fn-13">[13] pandas development team (2026) _pandas.DataFrame.shape_, pandas, Online.</fn>

<fn id="fn-14">[14] pandas development team (2026) _pandas.DataFrame.columns_, pandas, Online.</fn>

<fn id="fn-15">[15] pandas development team (2026) _pandas.DataFrame.dtypes_, pandas, Online.</fn>

<fn id="fn-16">[16] pandas development team (2026) _pandas.DataFrame.info_, pandas, Online.</fn>

<fn id="fn-17">[17] pandas development team (2026) _pandas.DataFrame.isna_, pandas, Online.</fn>

<fn id="fn-18">[18] pandas development team (2026) _pandas.DataFrame.describe_, pandas, Online.</fn>

<fn id="fn-19">[19] pandas development team (2026) _pandas.to_datetime_, pandas, Online.</fn>

<fn id="fn-20">[20] pandas development team (2026) _pandas.DataFrame.nunique_, pandas, Online.</fn>

<fn id="fn-21">[21] IBM (Unknown date) _What is Data Cleaning?_, IBM, Online.</fn>

<fn id="fn-22">[22] Tableau (Unknown date) _Data Cleaning: Definition, Benefits, and How-To_, Tableau, Online.</fn>

<fn id="fn-23">[23] Max Kuhn and Kjell Johnson (2026) _Feature Selection_, Applied Machine Learning for Tabular Data, Online.</fn>

<fn id="fn-24">[24] IBM (Unknown date) _What is Feature Selection?_, IBM, Online.</fn>

<fn id="fn-25">[25] Youran Zhou, Sunil Aryal and Mohamed Reda Bouadjenek (2024) _A Comprehensive Review of Handling Missing Data: Exploring Special Missing Mechanisms_, arXiv, Online.</fn>

<fn id="fn-26">[26] Cribl (Unknown date) _What is Data Normalization?_, Cribl, Online.</fn>

<fn id="fn-27">[27] The Epidemiologist R Handbook Contributors (Unknown date) _Working with dates_, The Epidemiologist R Handbook, Online.</fn>

<fn id="fn-28">[28] Skforecast Team (Unknown date) _Time series aggregation_, Skforecast, Online.</fn>

<fn id="fn-29">[29] Microsoft Support (Unknown date) _Join tables and queries_, Microsoft, Online.</fn>

<fn id="fn-30">[30] IBM (Unknown date) _What is Data Integration?_, IBM, Online.</fn>

<fn id="fn-31">[31] RudderStack (Unknown date) _What Is Data Validation? Why, When, and How To Use It_, RudderStack, Online.</fn>

<fn id="fn-32">[32] Google Cloud (Unknown date) _What is Time Series?_, Google, Online.</fn>

<fn id="fn-33">[33] Ali Suliman AlSalehy and Mike Bailey (2025) _Improving Time Series Data Quality: Identifying Outliers and Handling Missing Values in a Multilocation Gas and Weather Dataset_, MDPI, Basel, Switzerland.</fn>

<fn id="fn-34">[34] NIST/SEMATECH (Unknown date) _What is EDA?_, NIST/SEMATECH e-Handbook of Statistical Methods, Online.</fn>

<fn id="fn-35">[35] Rob J. Hyndman and George Athanasopoulos (2018) _Time series patterns_, OTexts, Melbourne, Australia.</fn>

<fn id="fn-36">[36] NIST/SEMATECH (Unknown date) _Introduction to Time Series Analysis_, NIST/SEMATECH e-Handbook of Statistical Methods, Online.</fn>

<fn id="fn-37">[37] NIST/SEMATECH (Unknown date) _Seasonality_, NIST/SEMATECH e-Handbook of Statistical Methods, Online.</fn>

<fn id="fn-38">[38] NIST/SEMATECH (Unknown date) _Histogram_, NIST/SEMATECH e-Handbook of Statistical Methods, Online.</fn>

<fn id="fn-39">[39] Penn State Eberly College of Science (Unknown date) _3.4.2 - Correlation_, The Pennsylvania State University, Online.</fn>

<fn id="fn-40">[40] Jim Frost (Unknown date) _Using Moving Averages to Smooth Time Series Data_, Statistics By Jim, Online.</fn>

<fn id="fn-41">[41] Josef Waples and Laiba Siddiqui (Unknown date) _Time Series Decomposition: Trends, Seasonality, and Noise_, DataCamp, Online.</fn>

<fn id="fn-42">[42] Penn State Eberly College of Science (Unknown date) _10.2 - Autocorrelation and Time Series Methods_, The Pennsylvania State University, Online.</fn>

<fn id="fn-43">[43] Minitab (Unknown date) _Interpret all statistics and graphs for Augmented Dickey-Fuller Test_, Minitab Support, Online.</fn>

<fn id="fn-44">[44] IBM (Unknown date) _What is Feature Engineering?_, IBM, Online.</fn>

<fn id="fn-45">[45] dotData (Unknown date) _Practical Guide for Feature Engineering of Time Series Data_, dotData, Online.</fn>

<fn id="fn-46">[46] Skforecast Team (Unknown date) _Cyclical features in time series_, Skforecast, Online.</fn>

<fn id="fn-47">[47] Feature-engine Developers (Unknown date) _Forecasting Features_, Feature-engine, Online.</fn>

<fn id="fn-48">[48] Feature-engine Developers (Unknown date) _LagFeatures_, Feature-engine, Online.</fn>

<fn id="fn-49">[49] ApX Machine Learning (2026) _Train-Test Split for Time Series_, ApX Machine Learning, Online.</fn>

<fn id="fn-50">[50] Pragati Baheti (2021) _Train Test Validation Split: How To and Best Practices_, V7 Labs, Online.</fn>

<fn id="fn-51">[51] IBM (Unknown date) _What is Supervised Learning?_, IBM, Online.</fn>

<fn id="fn-52">[52] ApX Machine Learning (2026) _Feature Scaling: Normalization and Standardization_, ApX Machine Learning, Online.</fn>
