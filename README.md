# theblaze-newsletter-ads
This workflow converts ad information to JSON feeds, and makes them accessible to our newsletter template as Sailthru includes — all from the command line. Updates do not interfere with our recurring campaign cycle.

## Installation
1. Clone the repository onto your machine.
2. Install dependencies using `npm install` from the project directory.

## Usage
Here's a list of available commands:
1. `npm run new`
2. `npm run sort`
3. `npm run minify`
4. `npm run filter`
5. `npm run push`&#42;
6. `npm run test`&#42;
7. `npm start`&#42;

All commands (except test) will ask you to select a JSON file from the ads/ folder:

```
[1] sponsor_natives
[2] sponsor_banners
[3] channel_banners
[0] CANCEL

Edit which file? [1, 2, 3, 0]: 1
You selected sponsor_natives.
```

Once the file is selected, the command will run.

------------------------------------------

### 1. Run "New"
Create a new ad. You will be prompted for the necessary values, and the result will be appended to the selected file as a new JSON object.

------------------------------------------

### 2. Run "Sort"
Sorts sponsor_natives or sponsor_banners in descending order by date. Note that channel_banners do not have "date" fields; they are sorted alphabetically by channel name.

------------------------------------------

### 3. Run "Minify"
Removes all spaces from the selected file and saves to ads/min. Ensures Sailthru can read the information properly when the file is pushed to production.

------------------------------------------

### 4. Run "Filter"
Shows outdated ads from the selected file and asks whether to delete or preserve them. Does not catch today's ads.

------------------------------------------

### 5. Run "Push"
Looks for the minified version of the selected file and wraps it around a Zephyr object. The Zephyr object is then formatted into a Sailthru include with the "phoenix_" prefix and pushed to production. **Make sure to minify your latest changes beforehand!**

------------------------------------------

### 6. Run "Test"
Send an email using the test versions of the AM / PM templates. **Multiple emails are now be separated by commas.**

------------------------------------------

### 7. "Start"
Runs all commands back-to-back, except for filter.

------------------------------------------

&#42; You will need to rename **scripts/sailthru-api-dummy.js** to **scripts/sailthru-api.js**, then insert the appropriate [Sailthru API information](https://my.sailthru.com/settings/api_postbacks) for these commands to work.
