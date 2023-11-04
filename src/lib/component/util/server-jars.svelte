<script lang="ts">
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";
    import {trackEvent} from "../../../app.js";

    let selectedType = "paper"
    let selectedVersion = "1.20.2"

    const info = [
        {
            platform: "forge",
            jars: [
                {
                    "version": "1.20.2",
                    "release": "October 25th 2023",
                    "size": "5.15 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.2-48.0.33/forge-1.20.2-48.0.33-installer.jar",
                },
                {
                    "version": "1.20.1",
                    "release": "September 28, 2023",
                    "size": "5.63 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.20.1-47.2.0/forge-1.20.1-47.2.0-installer.jar",
                },
                {
                    "version": "1.20",
                    "release": "June 11, 2023",
                    "size": "5.52 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.20-46.0.14/forge-1.20-46.0.14-installer.jar",
                },
                {
                    "version": "1.19.4",
                    "release": "October 18, 2023",
                    "size": "6.77 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.19.4-45.2.0/forge-1.19.4-45.2.0-installer.jar",
                },
                {
                    "version": "1.19.3",
                    "release": "March 09, 2023",
                    "size": "6.57 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.19.3-44.1.0/forge-1.19.3-44.1.0-installer.jar",
                },
                {
                    "version": "1.19.2",
                    "release": "September 28, 2023",
                    "size": "6.7 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.19.2-43.3.0/forge-1.19.2-43.3.0-installer.jar",
                },
                {
                    "version": "1.19.1",
                    "release": "August 05, 2022",
                    "size": "6.47 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.19.1-42.0.9/forge-1.19.1-42.0.9-installer.jar",
                },
                {
                    "version": "1.19",
                    "release": "July 27, 2022",
                    "size": "6.42 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.19-41.1.0/forge-1.19-41.1.0-installer.jar",
                },
                {
                    "version": "1.18.2",
                    "release": "July 14, 2023",
                    "size": "6.34 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.18.2-40.2.0/forge-1.18.2-40.2.0-installer.jar",
                },
                {
                    "version": "1.18.1",
                    "release": "March 01, 2022",
                    "size": "6.58 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.18.1-39.1.0/forge-1.18.1-39.1.0-installer.jar",
                },
                {
                    "version": "1.18",
                    "release": "December 10, 2021",
                    "size": "6.19 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.18-38.0.17/forge-1.18-38.0.17-installer.jar",
                },
                {
                    "version": "1.17.1",
                    "release": "December 10, 2021",
                    "size": "5.04 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.17.1-37.1.1/forge-1.17.1-37.1.1-installer.jar",
                },
                {
                    "version": "1.16.5",
                    "release": "July 17, 2022",
                    "size": "7.58 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.5-36.2.34/forge-1.16.5-36.2.34-installer.jar",
                },
                {
                    "version": "1.16.4",
                    "release": "January 15, 2021",
                    "size": "6.59 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.4-35.1.4/forge-1.16.4-35.1.4-installer.jar",
                },
                {
                    "version": "1.16.3",
                    "release": "November 02, 2020",
                    "size": "6.53 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.3-34.1.0/forge-1.16.3-34.1.0-installer.jar",
                },
                {
                    "version": "1.16.2",
                    "release": "September 10, 2020",
                    "size": "6.47 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.2-33.0.61/forge-1.16.2-33.0.61-installer.jar",
                },
                {
                    "version": "1.16.1",
                    "release": "August 09, 2020",
                    "size": "6.39 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.1-32.0.108/forge-1.16.1-32.0.108-installer.jar",
                },
                {
                    "version": "1.15.2",
                    "release": "December 17, 2019",
                    "size": "6.3 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.15.2-31.2.57/forge-1.15.2-31.2.57-installer.jar",
                },
                {
                    "version": "1.15.1",
                    "release": "December 11, 2021",
                    "size": "7.68 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.15.1-30.0.51/forge-1.15.1-30.0.51-installer.jar",
                },
                {
                    "version": "1.15",
                    "release": "January 22, 2020",
                    "size": "7.61 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.15-29.0.4/forge-1.15-29.0.4-installer.jar",
                },
                {
                    "version": "1.14.4",
                    "release": "December 11, 2021",
                    "size": "6.2 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.14.4-28.2.26/forge-1.14.4-28.2.26-installer.jar",
                },
                {
                    "version": "1.14.3",
                    "release": "July 19, 2019",
                    "size": "6.91 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.14.3-27.0.60/forge-1.14.3-27.0.60-installer.jar",
                },
                {
                    "version": "1.14.2",
                    "release": "June 24, 2019",
                    "size": "7.15 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.14.2-26.0.63/forge-1.14.2-26.0.63-installer.jar",
                },
                {
                    "version": "1.13.2",
                    "release": "December 11, 2021",
                    "size": "5.79 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.13.2-25.0.223/forge-1.13.2-25.0.223-installer.jar",
                },
                {
                    "version": "1.12.2",
                    "release": "December 13, 2021",
                    "size": "4.39 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.12.2-14.23.5.2859/forge-1.12.2-14.23.5.2859-installer.jar",
                },
                {
                    "version": "1.12.1",
                    "release": "August 01, 2017",
                    "size": "4.95 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.12.1-14.22.1.2478/forge-1.12.1-14.22.1.2478-installer.jar",
                },
                {
                    "version": "1.12",
                    "release": "September 18, 2017",
                    "size": "4.93 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.12-14.21.1.2387/forge-1.12-14.21.1.2387-installer.jar",
                },
                {
                    "version": "1.11.2",
                    "release": "January 10, 2018",
                    "size": "4.85 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.11.2-13.20.1.2588/forge-1.11.2-13.20.1.2588-installer.jar",
                },
                {
                    "version": "1.11",
                    "release": "December 23, 2016",
                    "size": "4.67 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.11-13.19.1.2189/forge-1.11-13.19.1.2189-installer.jar",
                },
                {
                    "version": "1.10.2",
                    "release": "October 08, 2017",
                    "size": "4.71 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.10.2-12.18.3.2511/forge-1.10.2-12.18.3.2511-installer.jar",
                },
                {
                    "version": "1.10",
                    "release": "June 26, 2016",
                    "size": "4.51 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.10-12.18.0.2000-1.10.0/forge-1.10-12.18.0.2000-1.10.0-installer.jar",
                },
                {
                    "version": "1.9.4",
                    "release": "June 08, 2017",
                    "size": "4.47 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.9.4-12.17.0.2317-1.9.4/forge-1.9.4-12.17.0.2317-1.9.4-installer.jar",
                },
                {
                    "version": "1.9",
                    "release": "June 01, 2016",
                    "size": "4.39 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.9-12.16.1.1887/forge-1.9-12.16.1.1887-installer.jar",
                },
                {
                    "version": "1.8.9",
                    "release": "June 08, 2017",
                    "size": "4.28 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.8.9-11.15.1.2318-1.8.9/forge-1.8.9-11.15.1.2318-1.8.9-installer.jar",
                },
                {
                    "version": "1.8.8",
                    "release": "December 29, 2015",
                    "size": "3.94 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.8.8-11.15.0.1655/forge-1.8.8-11.15.0.1655-installer.jar",
                },
                {
                    "version": "1.8",
                    "release": "November 22, 2015",
                    "size": "3.87 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.8-11.14.4.1563/forge-1.8-11.14.4.1563-installer.jar",
                },
                {
                    "version": "1.7.10",
                    "release": "December 09, 2015",
                    "size": "3.53 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.7.10-10.13.4.1614-1.7.10/forge-1.7.10-10.13.4.1614-1.7.10-installer.jar",
                },
                {
                    "version": "1.7.10_pre4",
                    "release": "June 26, 2014",
                    "size": "3.2 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.7.10_pre4-10.12.2.1149-prerelease/forge-1.7.10_pre4-10.12.2.1149-prerelease-installer.jar",
                },
                {
                    "version": "1.7.2",
                    "release": "July 02, 2014",
                    "size": "3.17 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.7.2-10.12.2.1161-mc172/forge-1.7.2-10.12.2.1161-mc172-installer.jar",
                },
                {
                    "version": "1.6.4",
                    "release": "March 28, 2015",
                    "size": "2.51 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.6.4-9.11.1.1345/forge-1.6.4-9.11.1.1345-installer.jar",
                },
                {
                    "version": "1.6.3",
                    "release": "September 19, 2013",
                    "size": "2.46 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.6.3-9.11.0.878/forge-1.6.3-9.11.0.878-installer.jar",
                },
                {
                    "version": "1.6.2",
                    "release": "September 15, 2013",
                    "size": "2.46 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.6.2-9.10.1.871/forge-1.6.2-9.10.1.871-installer.jar",
                },
                {
                    "version": "1.6.1",
                    "release": "July 06, 2013",
                    "size": "2.42 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.6.1-8.9.0.775/forge-1.6.1-8.9.0.775-installer.jar",
                },
                {
                    "version": "1.5.2",
                    "release": "June 17, 2013",
                    "size": "2.53 MB",
                    "downloadURL":"https://maven.minecraftforge.net/net/minecraftforge/forge/1.5.2-7.8.1.738/forge-1.5.2-7.8.1.738-installer.jar",
                },
            ],
            },
            {
            platform: "fabric",
            jars: [
                {
                    "version": "1.20.2",
                    "release": "September 12th, 2023",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.20.2/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.20",
                    "release": "May 25th, 2023",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.20/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.19.4",
                    "release": "March 1st, 2023",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.19.4/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.19.3",
                    "release": "November 24th, 2022",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.19.3/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.19",
                    "release": "June 7th, 2022",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.19/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.18",
                    "release": "November 30th, 2021",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.18/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.17",
                    "release": "June 8th, 2021",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.17/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.16.2",
                    "release": "August 11th, 2020",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.16.2/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.16",
                    "release": "June 23rd, 2020",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.16/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.15.2",
                    "release": "January 21st, 2020",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.15.2/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.15.1",
                    "release": "December 17th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.15.1/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.15",
                    "release": "December 10th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.15/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.14.4",
                    "release": "July 19th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.14.4/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.14.3",
                    "release": "June 24th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.14.3/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.14.2",
                    "release": "May 27th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.14.2/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.14.1",
                    "release": "May 13th, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.14.1/0.14.24/0.11.2/server/jar",
                },
                {
                    "version": "1.14",
                    "release": "April 23rd, 2019",
                    "size": "151 KB",
                    "downloadURL":"https://meta.fabricmc.net/v2/versions/loader/1.14/0.14.24/0.11.2/server/jar",
                },
            ],
        },
        {
            platform: "folia",
            jars: [
                {
                    "version": "1.20.1",
                    "release": "July 10th 2023",
                    "size": "41.4 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/folia/versions/1.20.1/builds/9/downloads/folia-1.20.1-9.jar"
                },
                {
                    "version": "1.19.4",
                    "release": "May 27th 2023",
                    "size": "40.9 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/folia/versions/1.19.4/builds/39/downloads/folia-1.19.4-39.jar"
                }
            ]
        },
        {
            platform: "purpur",
            jars: [
                {
                    "version": "1.20.2",
                    "release": "October 5th 2023",
                    "size": "44.5 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.20.2/2074/download"
                },
                {
                    "version": "1.20.1",
                    "release": "July 9th 2023",
                    "size": "44.68 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.20.1/2014/download"
                },
                {
                    "version": "1.20",
                    "release": "June 12th 2023",
                    "size": "44.00 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.20/1990/download"
                },
                {
                    "version": "1.19.4",
                    "release": "June 8th 2023",
                    "size": "45.80 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.19.4/1985/download"
                },
                {
                    "version": "1.19.3",
                    "release": "March 15th 2023",
                    "size": "40.78 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.19.3/1933/download"
                },
                {
                    "version": "1.19.2",
                    "release": "December 7th 2022",
                    "size": "38.84 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.19.2/1858/download"
                },
                {
                    "version": "1.19.1",
                    "release": "August 5th 2022",
                    "size": "40.27 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.19.1/1751/download"
                },
                {
                    "version": "1.19",
                    "release": "July 27th 2022",
                    "size": "40.39 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.19/1735/download"
                },
                {
                    "version": "1.18.2",
                    "release": "June 7th 2022",
                    "size": "37.13 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.18.2/1632/download"
                },
                {
                    "version": "1.18.1",
                    "release": "March 1th 2022",
                    "size": "36.99 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.18.1/1566/download"
                },
                {
                    "version": "1.18",
                    "release": "December 10th 2021",
                    "size": "34.41 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.18/1433/download"
                },
                {
                    "version": "1.17.1",
                    "release": "November 23nd 2021",
                    "size": "62.39 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.17.1/1428/download"
                },
                {
                    "version": "1.17",
                    "release": "July 6th 2021",
                    "size": "59.32 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.17/1255/download"
                },
                {
                    "version": "1.16.5",
                    "release": "June 18th 2021",
                    "size": "53.38 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.16.5/1171/download"
                },
                {
                    "version": "1.16.4",
                    "release": "January 15th 2021",
                    "size": "47.04 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.16.4/956/download"
                },
                {
                    "version": "1.16.3",
                    "release": "November 1th 2020",
                    "size": "46.09 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.16.3/808/download"
                },
                {
                    "version": "1.16.2",
                    "release": "September 10th 2020",
                    "size": "46.07 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.16.2/750/download"
                },
                {
                    "version": "1.16.1",
                    "release": "August 15th 2020",
                    "size": "46.18 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.16.1/710/download"
                },
                {
                    "version": "1.15.2",
                    "release": "June 25th 2020",
                    "size": "44.11 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.15.2/606/download"
                },
                {
                    "version": "1.15.1",
                    "release": "January 18th 2020",
                    "size": "47.84 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.15.1/397/download"
                },
                {
                    "version": "1.15",
                    "release": "December 17th 2019",
                    "size": "47.82 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.15/346/download"
                },
                {
                    "version": "1.14.4",
                    "release": "December 13th 2019",
                    "size": "47.58 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.14.4/337/download"
                },
                {
                    "version": "1.14.3",
                    "release": "July 19th 2019",
                    "size": "48.62 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.14.3/202/download"
                },
                {
                    "version": "1.14.2",
                    "release": "June 24rd 2019",
                    "size": "48.51 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.14.2/126/download"
                },
                {
                    "version": "1.14.1",
                    "release": "May 27th 2019",
                    "size": "48.44 MB",
                    "downloadURL": "https://api.purpurmc.org/v2/purpur/1.14.1/63/download"
                }
            ]
        },
        {
            platform: "pufferfish",
            jars: [
                {
                    "version": "1.20",
                    "release": "October 20th 2023",
                    "size": "42.24 MB",
                    "downloadURL": "https://ci.pufferfish.host/job/Pufferfish-1.20/lastSuccessfulBuild/artifact/build/libs/pufferfish-paperclip-1.20.2-R0.1-SNAPSHOT-reobf.jar"
                },
                {
                    "version": "1.19",
                    "release": "June 6th 2023",
                    "size": "43.16 MB",
                    "downloadURL": "https://ci.pufferfish.host/job/Pufferfish-1.19/lastSuccessfulBuild/artifact/build/libs/pufferfish-paperclip-1.19.4-R0.1-SNAPSHOT-reobf.jar"
                },
                {
                    "version": "1.18",
                    "release": "June 18th 2022",
                    "size": "35.7 MB",
                    "downloadURL": "https://ci.pufferfish.host/job/Pufferfish-1.18/lastSuccessfulBuild/artifact/build/libs/pufferfish-paperclip-1.18.2-R0.1-SNAPSHOT-reobf.jar"
                },
                {
                    "version": "1.17",
                    "release": "April 4th 2022",
                    "size": "61.21 MB",
                    "downloadURL": "https://ci.pufferfish.host/job/Pufferfish-1.17/lastSuccessfulBuild/artifact/build/libs/Pufferfish-1.17.1-R0.1-SNAPSHOT.jar"
                }
            ]
        },
        {
            platform: "paper",
            jars: [
                {
                    "version": "1.20.2",
                    "release": "October 5th 2023",
                    "size": "41.5 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.20.2/builds/217/downloads/paper-1.20.2-217.jar"
                },
                {
                    "version": "1.20.1",
                    "release": "July 11th 2023",
                    "size": "41.18 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds/71/downloads/paper-1.20.1-71.jar"
                },
                {
                    "version": "1.20",
                    "release": "June 13th 2023",
                    "size": "41.32 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.20/builds/17/downloads/paper-1.20-17.jar"
                },
                {
                    "version": "1.19.4",
                    "release": "June 8th 2023",
                    "size": "40.69 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.19.4/builds/550/downloads/paper-1.19.4-550.jar"
                },
                {
                    "version": "1.19.3",
                    "release": "March 12th 2023",
                    "size": "37.31 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.19.3/builds/448/downloads/paper-1.19.3-448.jar"
                },
                {
                    "version": "1.19.2",
                    "release": "December 6th 2022",
                    "size": "36.54 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.19.2/builds/307/downloads/paper-1.19.2-307.jar"
                },
                {
                    "version": "1.19.1",
                    "release": "August 5th 2022",
                    "size": "36.28 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.19.1/builds/111/downloads/paper-1.19.1-111.jar"
                },
                {
                    "version": "1.19",
                    "release": "July 25th 2022",
                    "size": "36.39 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.19/builds/81/downloads/paper-1.19-81.jar"
                },
                {
                    "version": "1.18.2",
                    "release": "September 20th 2022",
                    "size": "33.22 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.18.2/builds/388/downloads/paper-1.18.2-388.jar"
                },
                {
                    "version": "1.18.1",
                    "release": "February 28th 2022",
                    "size": "33.01 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.18.1/builds/216/downloads/paper-1.18.1-216.jar"
                },
                {
                    "version": "1.18",
                    "release": "December 10th 2021",
                    "size": "32.88 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.18/builds/66/downloads/paper-1.18-66.jar"
                },
                {
                    "version": "1.17.1",
                    "release": "April 14th 2022",
                    "size": "59.02 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.17.1/builds/411/downloads/paper-1.17.1-411.jar"
                },
                {
                    "version": "1.17",
                    "release": "July 6th 2021",
                    "size": "57.59 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.17/builds/79/downloads/paper-1.17-79.jar"
                },
                {
                    "version": "1.16.5",
                    "release": "December 18th 2021",
                    "size": "51.45 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.16.5/builds/794/downloads/paper-1.16.5-794.jar"
                },
                {
                    "version": "1.16.4",
                    "release": "January 15th 2021",
                    "size": "44.81 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.16.4/builds/416/downloads/paper-1.16.4-416.jar"
                },
                {
                    "version": "1.16.3",
                    "release": "November 1st 2020",
                    "size": "44.69 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.16.3/builds/253/downloads/paper-1.16.3-253.jar"
                },
                {
                    "version": "1.16.2",
                    "release": "September 10th 2020",
                    "size": "44.68 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.16.2/builds/189/downloads/paper-1.16.2-189.jar"
                },
                {
                    "version": "1.16.1",
                    "release": "August 23rd 2020",
                    "size": "44.81 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.16.1/builds/138/downloads/paper-1.16.1-138.jar"
                },
                {
                    "version": "1.15.2",
                    "release": "December 20th 2021",
                    "size": "42.94 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.15.2/builds/393/downloads/paper-1.15.2-393.jar"
                },
                {
                    "version": "1.15.1",
                    "release": "January 21st 2020",
                    "size": "41.91 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.15.1/builds/62/downloads/paper-1.15.1-62.jar"
                },
                {
                    "version": "1.15",
                    "release": "December 17th 2019",
                    "size": "41.89 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.15/builds/21/downloads/paper-1.15-21.jar"
                },
                {
                    "version": "1.14.4",
                    "release": "December 20th 2021",
                    "size": "41.94 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.14.4/builds/245/downloads/paper-1.14.4-245.jar"
                },
                {
                    "version": "1.14.3",
                    "release": "July 18th 2019",
                    "size": "42.26 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.14.3/builds/134/downloads/paper-1.14.3-134.jar"
                },
                {
                    "version": "1.14.2",
                    "release": "June 24th 2019",
                    "size": "42.21 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.14.2/builds/107/downloads/paper-1.14.2-107.jar"
                },
                {
                    "version": "1.14.1",
                    "release": "May 27th 2019",
                    "size": "42.18 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.14.1/builds/50/downloads/paper-1.14.1-50.jar"
                },
                {
                    "version": "1.14",
                    "release": "May 13th 2019",
                    "size": "42.15 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.14/builds/17/downloads/paper-1.14-17.jar"
                },
                {
                    "version": "1.13.2",
                    "release": "December 20th 2021",
                    "size": "42.91 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.13.2/builds/657/downloads/paper-1.13.2-657.jar"
                },
                {
                    "version": "1.13.1",
                    "release": "October 22nd 2018",
                    "size": "41.04 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.13.1/builds/386/downloads/paper-1.13.1-386.jar"
                },
                {
                    "version": "1.13",
                    "release": "August 26th 2018",
                    "size": "39.94 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.13/builds/173/downloads/paper-1.13-173.jar"
                },
                {
                    "version": "1.12.2",
                    "release": "December 20th 2021",
                    "size": "39.08 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.12.2/builds/1620/downloads/paper-1.12.2-1620.jar"
                },
                {
                    "version": "1.12.1",
                    "release": "September 14th 2017",
                    "size": "36.83 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.12.1/builds/1204/downloads/paper-1.12.1-1204.jar"
                },
                {
                    "version": "1.12",
                    "release": "August 1st 2017",
                    "size": "36.57 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.12/builds/1169/downloads/paper-1.12-1169.jar"
                },
                {
                    "version": "1.11.2",
                    "release": "December 20th 2021",
                    "size": "23.16 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.11.2/builds/1106/downloads/paper-1.11.2-1106.jar"
                },
                {
                    "version": "1.10.2",
                    "release": "December 20th 2021",
                    "size": "20.08 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.10.2/builds/918/downloads/paper-1.10.2-918.jar"
                },
                {
                    "version": "1.9.4",
                    "release": "December 20th 2021",
                    "size": "19.99 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.9.4/builds/775/downloads/paper-1.9.4-775.jar"
                },
                {
                    "version": "1.8.8",
                    "release": "December 20th 2021",
                    "size": "18.62 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/paper/versions/1.8.8/builds/445/downloads/paper-1.8.8-445.jar"
                }
            ]
        },
        {
            platform: "spigot",
            jars: [
                {
                    "version": "1.20.2",
                    "size": "69.0 MB",
                    "release": "September 21st 2023"
                },
                {
                    "version": "1.20.1",
                    "size": "67.8 MB",
                    "release": "June 12th 2023"
                },
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
            platform: "craftbukkit",
            jars: [
                {
                    "version": "1.20.1",
                    "release": "June 12th 2023",
                    "size": "68.4 MB"
                },
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
                    "version": "1.20.2",
                    "release": "September 21st 2023",
                    "size": "47.1 MB"
                },
                {
                    "version": "1.20.1",
                    "release": "June 12th 2023",
                    "size": "45.6 MB"
                },
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
            ]
        },
        {
            platform: "velocity",
            jars: [
                {
                    "version": "1.8-1.20.2",
                    "release": "28th June 2023",
                    "size": "15.6 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/velocity/versions/3.2.0-SNAPSHOT/builds/260/downloads/velocity-3.2.0-SNAPSHOT-260.jar"
                }
            ]
        },
        {
            platform: "waterfall",
            jars: [
                {
                    "version": "1.20",
                    "release": "7th June 2023",
                    "size": "21.3 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.20/builds/536/downloads/waterfall-1.20-536.jar"
                },
                {
                    "version": "1.19",
                    "release": "7th June 2023",
                    "size": "21.3 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.19/builds/535/downloads/waterfall-1.19-535.jar"
                },
                {
                    "version": "1.18",
                    "release": "30th May 2022",
                    "size": "20.8 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.18/builds/488/downloads/waterfall-1.18-488.jar"
                },
                {
                    "version": "1.17",
                    "release": "16th November 2021",
                    "size": "17 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.17/builds/454/downloads/waterfall-1.17-454.jar"
                },
                {
                    "version": "1.16",
                    "release": "7th June 2021",
                    "size": "16.9 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.16/builds/431/downloads/waterfall-1.16-431.jar"
                },
                {
                    "version": "1.15",
                    "release": "23rd June 2020",
                    "size": "13 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.15/builds/350/downloads/waterfall-1.15-350.jar"
                },
                {
                    "version": "1.14",
                    "release": "10th December 2019",
                    "size": "12.8 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.14/builds/301/downloads/waterfall-1.14-301.jar"
                },
                {
                    "version": "1.13",
                    "release": "22nd April 2019",
                    "size": "13.7 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.13/builds/268/downloads/waterfall-1.13-268.jar"
                },
                {
                    "version": "1.12",
                    "release": "13th July 2018",
                    "size": "13 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.12/builds/185/downloads/waterfall-1.12-185.jar"
                },
                {
                    "version": "1.11",
                    "release": "28th April 2017",
                    "size": "10.1 MB",
                    "downloadURL": "https://api.papermc.io/v2/projects/waterfall/versions/1.11/builds/108/downloads/waterfall-1.11-108.jar"
                },
            ]
        }
    ]

    function downloadSuccess() {
        getDownloadURL()
        toast.push('Downloaded successfully!', {
            theme: {
                '--toastColor': 'mintcream',
                '--toastBackground': 'rgba(72,187,120,0.9)',
                '--toastBarBackground': '#2F855A'
            }
        })

        trackEvent('server-jars-download', 'type', selectedType);
    }

    onMount(() => {
        getDownloadURL()
    })

    let downloadURL = ""
    function getDownloadURL() {
        const result = info.find(item => item.platform === selectedType);
        if (result) {
            const jar = result.jars.find(item => item.version === selectedVersion);
            if (jar) {
                downloadURL = jar.downloadURL;
                return true
            }
        }
        return false
    }

    // Keep selected version if exists in new type, if not select highest
    function select() {
        if (!getDownloadURL()) {
            const result = info.find(item => item.platform === selectedType);
            selectedVersion = result?.jars[0].version
        }
    }
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} on:change={select} id="type" class="w-[140px] scroll">
            <option value="velocity" class="scroll-option">Velocity (Proxy)</option>
            <option value="waterfall" class="scroll-option">Waterfall (Proxy)</option>
            <option disabled value="bungee" class="scroll-option">BungeeCord (Coming Soon)</option>
            <option value="folia" class="scroll-option">Folia</option>
            <option value="purpur" class="scroll-option">Purpur</option>
            <option value="pufferfish" class="scroll-option">Pufferfish</option>
            <option value="paper" class="scroll-option">Paper</option>
            <option value="spigot" class="scroll-option">Spigot</option>
            <option value="craftbukkit" class="scroll-option">CraftBukkit</option>
            <option value="vanilla" class="scroll-option">Vanilla</option>
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select bind:value={selectedVersion} id="underline_select2" class="w-[120px] scroll">
            {#each info.find(item => item.platform === selectedType).jars as jar}
                <option value="{jar.version}" class="scroll-option">{jar.version}</option>
            {/each}
        </select>
    </div>
    {#if selectedType === "paper" || selectedType === "pufferfish" || selectedType === "purpur" || selectedType === "folia" || selectedType === "waterfall" || selectedType === "velocity"}
        <a href="{downloadURL}" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
    {:else}
        <a href="https://cdn.mcutils.com/jars/{selectedType}-{selectedVersion}.jar" aria-label='Download Jar' class="self-end"><button class="button h-fit" on:click={downloadSuccess}>Download</button></a>
    {/if}
</div>

<table class="w-[90%] lg:w-[60%] text-white mt-12">
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
                <a aria-label='Download Jar' href="{jar.downloadURL ? jar.downloadURL : 'https://cdn.mcutils.com/jars/' + selectedType + '-' + jar.version + '.jar'}">
                    <button on:click={downloadSuccess}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="fill-[#626875] pl-4 h-5"><path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H32zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V242.7l73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/></svg>
                    </button>
                </a>
            </td>
        </tr>
    {/each}
</table>