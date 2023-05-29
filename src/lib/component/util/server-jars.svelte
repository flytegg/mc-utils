<script lang="ts">
    let selectedType = "spigot"

    const info = [
        {
            platform: "paper",
            jars: []
        },
        {
            platform: "spigot",
            jars: [
                {
                    "version": "1.19.4",
                    "size": "67.8 MB",
                    "release": "March 14th 2023"
                },
                {
                    "version": "1.19.3",
                    "size": "64.6 MB",
                    "release": "December 7th 2022"
                },
                {
                    "version": "1.19.2",
                    "size": "63.9 MB",
                    "release": "August 5th 2022"
                },
                {
                    "version": "1.19.1",
                    "size": "63.9 MB",
                    "release": "July 27th 2022"
                },
                {
                    "version": "1.19",
                    "size": "63.8 MB",
                    "release": "June 7th 2022"
                },
                {
                    "version": "1.18.2",
                    "size": "64.7 MB",
                    "release": "March 6th 2022"
                },
                {
                    "version": "1.18.1",
                    "size": "64.4 MB",
                    "release": "December 10th 2021"
                },
                {
                    "version": "1.18",
                    "size": "64.4 MB",
                    "release": "November 30th 2021"
                },
                {
                    "version": "1.17.1",
                    "size": "43.1 MB",
                    "release": "July 6th 2021"
                },
                {
                    "version": "1.17",
                    "size": "43.0 MB",
                    "release": "June 11th 2021"
                },
                {
                    "version": "1.16.5",
                    "size": "34.18 MB",
                    "release": "January 17th 2021"
                },
                {
                    "version": "1.16.4",
                    "size": "34.13 MB",
                    "release": "October 29th 2020"
                },
                {
                    "version": "1.16.3",
                    "size": "34.11 MB",
                    "release": "September 15th 2020"
                },
                {
                    "version": "1.16.2",
                    "size": "34.06 MB",
                    "release": "August 12th 2020"
                },
                {
                    "version": "1.16.1",
                    "size": "34.01 MB",
                    "release": "June 24th 2020"
                },
                {
                    "version": "1.15.2",
                    "size": "30.98 MB",
                    "release": "January 21st 2020"
                },
                {
                    "version": "1.15.1",
                    "size": "30.8 MB",
                    "release": "December 17th 2019"
                },
                {
                    "version": "1.15",
                    "size": "30.8 MB",
                    "release": "December 10th 2019"
                },
                {
                    "version": "1.14.4",
                    "size": "30.5 MB",
                    "release": "July 19th 2019"
                },
                {
                    "version": "1.14.3",
                    "size": "30.31 MB",
                    "release": "June 24th 2019"
                },
                {
                    "version": "1.14.2",
                    "size": "30.28 MB",
                    "release": "May 27th 2019"
                },
                {
                    "version": "1.14.1",
                    "size": "30.43 MB",
                    "release": "May 15th 2019"
                },
                {
                    "version": "1.14",
                    "size": "30.31 MB",
                    "release": "April 28th 2019"
                },
                {
                    "version": "1.13.2",
                    "size": "45.09 MB",
                    "release": "October 23rd 2018"
                },
                {
                    "version": "1.13.1",
                    "size": "44.73 MB",
                    "release": "August 27th 2018"
                },
                {
                    "version": "1.13",
                    "size": "43.71 MB",
                    "release": "July 22nd 2018"
                },
                {
                    "version": "1.12.2",
                    "size": "41.14 MB",
                    "release": "September 18th 2017"
                },
                {
                    "version": "1.12.1",
                    "size": "40.54 MB",
                    "release": "August 4th 2017"
                },
                {
                    "version": "1.12",
                    "size": "40.15 MB",
                    "release": "June 7th 2017"
                },
                {
                    "version": "1.11.2",
                    "size": "23.41 MB",
                    "release": "May 18th 2017"
                },
                {
                    "version": "1.11.1",
                    "size": "21.67 MB",
                    "release": "December 21st 2016"
                },
                {
                    "version": "1.11",
                    "size": "21.66 MB",
                    "release": "December 20th 2016"
                },
                {
                    "version": "1.10.2",
                    "size": "20.12 MB",
                    "release": "November 16th 2016"
                },
                {
                    "version": "1.10",
                    "size": "20.1 MB",
                    "release": "June 26th 2016"
                },
                {
                    "version": "1.9.4",
                    "size": "20.02 MB",
                    "release": "June 9th 2016"
                },
                {
                    "version": "1.9.2",
                    "size": "19.56 MB",
                    "release": "March 30th 2016"
                },
                {
                    "version": "1.9",
                    "size": "19.48 MB",
                    "release": "February 29th 2016"
                },
                {
                    "version": "1.8.8",
                    "size": "18.84 MB",
                    "release": "July 28th 2015"
                },
                {
                    "version": "1.8.7",
                    "size": "20.57 MB",
                    "release": "June 5th 2015"
                },
                {
                    "version": "1.8.6",
                    "size": "20.55 MB",
                    "release": "May 25th 2015"
                },
                {
                    "version": "1.8.5",
                    "size": "20.56 MB",
                    "release": "May 22nd 2015"
                },
                {
                    "version": "1.8.4",
                    "size": "20.53 MB",
                    "release": "April 17th 2015"
                },
                {
                    "version": "1.8.3",
                    "size": "20.55 MB",
                    "release": "February 20th 2015"
                },
                {
                    "version": "1.8",
                    "size": "18.81 MB",
                    "release": "August 2nd 2014"
                },
                {
                    "version": "1.7.10",
                    "size": "19.66 MB",
                    "release": "June 26th 2014"
                },
                {
                    "version": "1.7.9",
                    "size": "21.99 MB",
                    "release": "April 14th 2014"
                },
                {
                    "version": "1.7.8",
                    "size": "21.98 MB",
                    "release": "April 11th 2014"
                },
                {
                    "version": "1.7.5",
                    "size": "22.35 MB",
                    "release": "February 26th 2014"
                },
                {
                    "version": "1.7.2",
                    "size": "21.51 MB",
                    "release": "October 25th 2013"
                },
                {
                    "version": "1.6.4",
                    "size": "20.6 MB",
                    "release": "September 19th 2013"
                },
                {
                    "version": "1.6.2",
                    "size": "18.65 MB",
                    "release": "July 8th 2013"
                },
                {
                    "version": "1.5.2",
                    "size": "16.62 MB",
                    "release": "May 2nd 2013"
                },
                {
                    "version": "1.5.1",
                    "size": "15.86 MB",
                    "release": "March 21st 2013"
                },
                {
                    "version": "1.4.7",
                    "size": "15.48 MB",
                    "release": "January 9th 2013"
                },
                {
                    "version": "1.4.6",
                    "size": "14.11 MB",
                    "release": "December 20th 2012"
                }
            ]
        },
        {
            platform: "bukkit",
            jars: [
                {
                    "version": "1.19.4",
                    "release": "March 14th 2023",
                    "size": "67.6 MB"
                },
                {
                    "version": "1.19.3",
                    "release": "December 7th 2022",
                    "size": "64.3 MB"
                },
                {
                    "version": "1.19.2",
                    "release": "August 5th 2022",
                    "size": "63.7 MB"
                },
                {
                    "version": "1.19.1",
                    "release": "July 27th 2022",
                    "size": "63.7 MB"
                },
                {
                    "version": "1.19",
                    "release": "June 7th 2022",
                    "size": "63.6 MB"
                },
                {
                    "version": "1.18.2",
                    "release": "March 6th 2022",
                    "size": "64.5 MB"
                },
                {
                    "version": "1.18.1",
                    "release": "December 10th 2021",
                    "size": "64.2 MB"
                },
                {
                    "version": "1.18",
                    "release": "November 30th 2021",
                    "size": "64.2 MB"
                },
                {
                    "version": "1.17.1",
                    "release": "July 6th 2021",
                    "size": "42.8 MB"
                },
                {
                    "version": "1.17",
                    "release": "June 11th 2021",
                    "size": "42.7 MB"
                },
                {
                    "version": "1.16.5",
                    "release": "January 17th 2021",
                    "size": "33.92 MB"
                },
                {
                    "version": "1.16.4",
                    "release": "October 29th 2020",
                    "size": "33.87 MB"
                },
                {
                    "version": "1.16.3",
                    "release": "September 15th 2020",
                    "size": "33.85 MB"
                },
                {
                    "version": "1.16.2",
                    "release": "August 12th 2020",
                    "size": "33.8 MB"
                },
                {
                    "version": "1.16.1",
                    "release": "June 24th 2020",
                    "size": "33.8 MB"
                },
                {
                    "version": "1.15.2",
                    "release": "January 21st 2020",
                    "size": "30.74 MB"
                },
                {
                    "version": "1.15.1",
                    "release": "December 17th 2019",
                    "size": "30.6 MB"
                },
                {
                    "version": "1.15",
                    "release": "December 10th 2019",
                    "size": "30.62 MB"
                },
                {
                    "version": "1.14.4",
                    "release": "July 19th 2019",
                    "size": "30.33 MB"
                },
                {
                    "version": "1.14.3",
                    "release": "July 13th 2019",
                    "size": "30.15 MB"
                },
                {
                    "version": "1.14.2",
                    "release": "May 27th 2019",
                    "size": "30.08 MB"
                },
                {
                    "version": "1.14.1",
                    "release": "May 15th 2019",
                    "size": "30.24 MB"
                },
                {
                    "version": "1.14",
                    "release": "April 28th 2019",
                    "size": "30.12 MB"
                },
                {
                    "version": "1.13.2",
                    "release": "October 23rd 2018",
                    "size": "42.45 MB"
                },
                {
                    "version": "1.13.1",
                    "release": "August 27th 2018",
                    "size": "42.09 MB"
                },
                {
                    "version": "1.13",
                    "release": "July 22nd 2018",
                    "size": "41.08 MB"
                },
                {
                    "version": "1.12.2",
                    "release": "September 18th 2017",
                    "size": "38.51 MB"
                },
                {
                    "version": "1.12.1",
                    "release": "August 4th 2017",
                    "size": "37.92 MB"
                },
                {
                    "version": "1.12",
                    "release": "June 7th 2017",
                    "size": "37.53 MB"
                },
                {
                    "version": "1.11.2",
                    "release": "May 18th 2017",
                    "size": "20.79 MB"
                },
                {
                    "version": "1.11.1",
                    "release": "December 21st 2016",
                    "size": "19.06 MB"
                },
                {
                    "version": "1.11",
                    "release": "December 20th 2016",
                    "size": "19.05 MB"
                },
                {
                    "version": "1.10.2",
                    "release": "November 16th 2016",
                    "size": "17.51 MB"
                },
                {
                    "version": "1.10",
                    "release": "June 26th 2016",
                    "size": "17.49 MB"
                },
                {
                    "version": "1.9.4",
                    "release": "June 9th 2016",
                    "size": "17.41 MB"
                },
                {
                    "version": "1.9.2",
                    "release": "March 30th 2016",
                    "size": "16.95 MB"
                },
                {
                    "version": "1.9",
                    "release": "February 29th 2016",
                    "size": "16.95 MB"
                },
                {
                    "version": "1.8.8",
                    "release": "July 28th 2015",
                    "size": "16.19 MB"
                },
                {
                    "version": "1.8.7",
                    "release": "June 5th 2015",
                    "size": "17.96 MB"
                },
                {
                    "version": "1.8.6",
                    "release": "May 25th 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8.5",
                    "release": "May 22nd 2015",
                    "size": "17.96 MB"
                },
                {
                    "version": "1.8.4",
                    "release": "April 17th 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8.3",
                    "release": "February 20th 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8",
                    "release": "September 2nd 2014",
                    "size": "18.63 MB"
                },
                {
                    "version": "1.7.10",
                    "release": "June 26th 2014",
                    "size": "19.52 MB"
                },
                {
                    "version": "1.7.9",
                    "release": "April 14th 2014",
                    "size": "19.51 MB"
                },
                {
                    "version": "1.7.8",
                    "release": "April 11th 2014",
                    "size": "19.5 MB"
                },
                {
                    "version": "1.7.5",
                    "release": "February 26th 2014",
                    "size": "19.06 MB"
                },
                {
                    "version": "1.7.2",
                    "release": "October 25th 2013",
                    "size": "19.05 MB"
                },
                {
                    "version": "1.6.4",
                    "release": "September 19th 2013",
                    "size": "14.59 MB"
                },
                {
                    "version": "1.6.2",
                    "release": "July 8th 2013",
                    "size": "14.56 MB"
                },
                {
                    "version": "1.6.1",
                    "release": "July 1st 2013",
                    "size": "14.53 MB"
                },
                {
                    "version": "1.5.2",
                    "release": "May 2nd 2013",
                    "size": "12.37 MB"
                },
                {
                    "version": "1.5.1",
                    "release": "March 21st 2013",
                    "size": "12.36 MB"
                },
                {
                    "version": "1.5",
                    "release": "March 13th 2013",
                    "size": "12.29 MB"
                },
                {
                    "version": "1.4.7",
                    "release": "January 9th 2013",
                    "size": "12.02 MB"
                },
                {
                    "version": "1.4.6",
                    "release": "December 20th 2012",
                    "size": "14.22 MB"
                },
                {
                    "version": "1.4.5",
                    "release": "November 20th 2012",
                    "size": "14.35 MB"
                },
                {
                    "version": "1.4.2",
                    "release": "October 25th 2012",
                    "size": "11.49 MB"
                },
                {
                    "version": "1.3.2",
                    "release": "August 16th 2012",
                    "size": "11.19 MB"
                },
                {
                    "version": "1.3.1",
                    "release": "August 1st 2012",
                    "size": "11.18 MB"
                },
                {
                    "version": "1.2.5",
                    "release": "April 4th 2012",
                    "size": "10.71 MB"
                },
                {
                    "version": "1.2.4",
                    "release": "March 22nd 2012",
                    "size": "10.58 MB"
                },
                {
                    "version": "1.2.3",
                    "release": "March 2nd 2012",
                    "size": "10.58 MB"
                },
                {
                    "version": "1.2.2",
                    "release": "March 1st 2012",
                    "size": "10.53 MB"
                },
                {
                    "version": "1.1",
                    "release": "January 12th 2012",
                    "size": "10.3 MB"
                },
                {
                    "version": "1.0.0",
                    "release": "November 18th 2011",
                    "size": "9.32 MB"
                }
            ]
        },
        {
            platform: "vanilla",
            jars: [
                {
                    "version": "1.19.4",
                    "release": "March 14th 2023",
                    "size": "45.3 MB"
                },
                {
                    "version": "1.19.3",
                    "release": "December 7th 2022",
                    "size": "45 MB"
                },
                {
                    "version": "1.19.2",
                    "release": "August 5th 2022",
                    "size": "43.5 MB"
                },
                {
                    "version": "1.19.1",
                    "release": "July 27th 2022",
                    "size": "43.5 MB"
                },
                {
                    "version": "1.19",
                    "release": "June 7th 2022",
                    "size": "43.4 MB"
                },
                {
                    "version": "1.18.2",
                    "release": "March 6th 2022",
                    "size": "44.4 MB"
                },
                {
                    "version": "1.18.1",
                    "release": "December 10th 2021",
                    "size": "44.2 MB"
                },
                {
                    "version": "1.18",
                    "release": "November 30th 2021",
                    "size": "44.2 MB"
                },
                {
                    "version": "1.17.1",
                    "release": "July 6th 2021",
                    "size": "41.6 MB"
                },
                {
                    "version": "1.17",
                    "release": "June 8th 2021",
                    "size": "41.6 MB"
                },
                {
                    "version": "1.16.5",
                    "release": "January 15th 2021",
                    "size": "36.2 MB"
                },
                {
                    "version": "1.16.4",
                    "release": "October 29th 2020",
                    "size": "36.2 MB"
                },
                {
                    "version": "1.16.3",
                    "release": "September 10th 2020",
                    "size": "36.2 MB"
                },
                {
                    "version": "1.16.2",
                    "release": "August 12th 2020",
                    "size": "36.2 MB"
                },
                {
                    "version": "1.16.1",
                    "release": "June 24th 2020",
                    "size": "36.2 MB"
                },
                {
                    "version": "1.15.2",
                    "release": "January 21st 2020",
                    "size": "34.5 MB"
                },
                {
                    "version": "1.15.1",
                    "release": "December 17th 2019",
                    "size": "34.5 MB"
                },
                {
                    "version": "1.15",
                    "release": "December 10th 2019",
                    "size": "34.5 MB"
                },
                {
                    "version": "1.14.4",
                    "release": "July 19th 2019",
                    "size": "34.3 MB"
                },
                {
                    "version": "1.14.3",
                    "release": "June 24th 2019",
                    "size": "34.3 MB"
                },
                {
                    "version": "1.14.2",
                    "release": "May 27th 2019",
                    "size": "34.3 MB"
                },
                {
                    "version": "1.14.1",
                    "release": "May 13th 2019",
                    "size": "34.3 MB"
                },
                {
                    "version": "1.14",
                    "release": "April 23rd 2019",
                    "size": "34.3 MB"
                },
                {
                    "version": "1.13.2",
                    "release": "October 22nd 2018",
                    "size": "32.3 MB"
                },
                {
                    "version": "1.13.1",
                    "release": "August 27th 2018",
                    "size": "32.3 MB"
                },
                {
                    "version": "1.13",
                    "release": "July 19th 2018",
                    "size": "31.1 MB"
                },
                {
                    "version": "1.12.2",
                    "release": "September 18th 2017",
                    "size": "28.8 MB"
                },
                {
                    "version": "1.12.1",
                    "release": "August 4th 2017",
                    "size": "28.8 MB"
                },
                {
                    "version": "1.12",
                    "release": "June 7th 2017",
                    "size": "28.8 MB"
                },
                {
                    "version": "1.11.2",
                    "release": "May 18th 2017",
                    "size": "9.29 MB"
                },
                {
                    "version": "1.11.1",
                    "release": "December 20th 2016",
                    "size": "9.27 MB"
                },
                {
                    "version": "1.11",
                    "release": "November 14th 2016",
                    "size": "9.26 MB"
                },
                {
                    "version": "1.10.2",
                    "release": "June 23rd 2016",
                    "size": "9.26 MB"
                },
                {
                    "version": "1.10.1",
                    "release": "June 22nd 2016",
                    "size": "9.26 MB"
                },
                {
                    "version": "1.10",
                    "release": "June 8th 2016",
                    "size": "9.02 MB"
                },
                {
                    "version": "1.9.4",
                    "release": "May 10th 2016",
                    "size": "8.96 MB"
                },
                {
                    "version": "1.9.3",
                    "release": "May 10th 2016",
                    "size": "8.96 MB"
                },
                {
                    "version": "1.9.2",
                    "release": "March 30th 2016",
                    "size": "8.44 MB"
                },
                {
                    "version": "1.9.1",
                    "release": "March 30th 2016",
                    "size": "8.44 MB"
                },
                {
                    "version": "1.9",
                    "release": "February 29th 2016",
                    "size": "8.44 MB"
                },
                {
                    "version": "1.8.9",
                    "release": "December 3rd 2015",
                    "size": "7.94 MB"
                },
                {
                    "version": "1.8.8",
                    "release": "July 27th 2015",
                    "size": "7.94 MB"
                },
                {
                    "version": "1.8.7",
                    "release": "June 5th 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.6",
                    "release": "May 25th 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.5",
                    "release": "May 22nd 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.4",
                    "release": "April 17th 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.3",
                    "release": "February 20th 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.2",
                    "release": "February 19th 2015",
                    "size": "9.33 MB"
                },
                {
                    "version": "1.8.1",
                    "release": "November 24th 2014",
                    "size": "7.54 MB"
                },
                {
                    "version": "1.8",
                    "release": "September 2nd 2014",
                    "size": "9.89 MB"
                },
                {
                    "version": "1.7.10",
                    "release": "May 14th 2014",
                    "size": "9.16 MB"
                },
                {
                    "version": "1.7.9",
                    "release": "April 14th 2014",
                    "size": "9.16 MB"
                },
                {
                    "version": "1.7.6",
                    "release": "April 9th 2014",
                    "size": "9.04 MB"
                },
                {
                    "version": "1.7.7",
                    "release": "April 9th 2014",
                    "size": "9.04 MB"
                },
                {
                    "version": "1.7.8",
                    "release": "April 9th 2014",
                    "size": "9.16 MB"
                },
                {
                    "version": "1.7.5",
                    "release": "February 26th 2014",
                    "size": "8.75 MB"
                },
                {
                    "version": "1.7.4",
                    "release": "December 9th 2013",
                    "size": "8.75 MB"
                },
                {
                    "version": "1.7.3",
                    "release": "December 6th 2013",
                    "size": "8.75 MB"
                },
                {
                    "version": "1.7.2",
                    "release": "October 25th 2013",
                    "size": "8.74 MB"
                },
                {
                    "version": "1.6.4",
                    "release": "September 19th 2013",
                    "size": "5.85 MB"
                },
                {
                    "version": "1.6.2",
                    "release": "July 5th 2013",
                    "size": "5.85 MB"
                },
                {
                    "version": "1.6.1",
                    "release": "June 28th 2013",
                    "size": "2.25 MB"
                },
                {
                    "version": "1.5.2",
                    "release": "April 25th 2013",
                    "size": "2.25 MB"
                },
                {
                    "version": "1.5.1",
                    "release": "March 20th 2013",
                    "size": "1.97 MB"
                },
                {
                    "version": "1.4.7",
                    "release": "December 27th 2012",
                    "size": "1.97 MB"
                },
                {
                    "version": "1.4.6",
                    "release": "December 19th 2012",
                    "size": "1.95 MB"
                },
                {
                    "version": "1.4.5",
                    "release": "December 19th 2012",
                    "size": "1.95 MB"
                },
                {
                    "version": "1.4.4",
                    "release": "December 13th 2012",
                    "size": "1.95 MB"
                },
                {
                    "version": "1.4.2",
                    "release": "November 24th 2012",
                    "size": "1.92 MB"
                },
                {
                    "version": "1.3.2",
                    "release": "August 15th 2012",
                    "size": "1.72 MB"
                },
                {
                    "version": "1.3.1",
                    "release": "July 31st 2012",
                    "size": "1.72 MB"
                },
                {
                    "version": "1.2.5",
                    "release": "March 29th 2012",
                    "size": "1.34 MB"
                },
                {
                    "version": "1.2.5",
                    "release": "February 29th 2012",
                    "size": "1.34 MB"
                }
            ]
        }
    ]
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} id="type" class="w-[120px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="paper" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Paper</option>
            <option value="spigot" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Spigot</option>
            <option value="bukkit" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Bukkit</option>
            <option value="vanilla" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">Vanilla</option>
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select id="underline_select2" class="w-[120px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            {#each info.find(item => item.platform === selectedType).jars as jar}
                <option value="{jar.version}" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">{jar.version}</option>
            {/each}
        </select>
    </div>
    <button class="button h-fit self-center">Download</button>
</div>

<table class="w-[60%] text-white mt-12 mb-12">
    <tr class="bg-[#1d1f24]">
        <th class="rounded-tl-lg rounded-bl-lg p-2 pl-6 font-medium text-[20px] text-left">Version</th>
        <th class="font-medium text-[20px] text-left">Release Date</th>
        <th class="rounded-tr-lg rounded-br-lg font-medium text-[20px] text-left">Size</th>
        <th class="font-medium text-[20px] text-left bg-[#1a1b1e] "></th>
    </tr>
    {#each info.find(item => item.platform === selectedType).jars as jar}
        <tr class="">
            <td class="pl-6 p-1.5 border-b-2 border-b-[#1D1F24] text-gray-400">{jar.version}</td>
            <td class="border-b-2 border-b-[#1D1F24] text-gray-400">{jar.release}</td>
            <td class="border-b-2 border-b-[#1D1F24] text-gray-400">{jar.size}</td>
            <td>
                <a href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-[#626875] pl-4 h-5"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                </a>
            </td>
        </tr>
    {/each}
</table>