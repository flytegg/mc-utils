<script lang="ts">
    const name = "Server Jars"
    const description = "Download existing jar files for<br>popular server software."
    const shortDescription = "addw3dwaw"

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
                    "release": "Tuesday, March 14 2023"
                },
                {
                    "version": "1.19.3",
                    "size": "64.6 MB",
                    "release": "Wednesday, December 07 2022"
                },
                {
                    "version": "1.19.2",
                    "size": "63.9 MB",
                    "release": "Friday, August 05 2022"
                },
                {
                    "version": "1.19.1",
                    "size": "63.9 MB",
                    "release": "Wednesday, July 27 2022"
                },
                {
                    "version": "1.19",
                    "size": "63.8 MB",
                    "release": "Tuesday, June 07 2022"
                },
                {
                    "version": "1.18.2",
                    "size": "64.7 MB",
                    "release": "Sunday, March 06 2022"
                },
                {
                    "version": "1.18.1",
                    "size": "64.4 MB",
                    "release": "Friday, December 10 2021"
                },
                {
                    "version": "1.18",
                    "size": "64.4 MB",
                    "release": "Tuesday, November 30 2021"
                },
                {
                    "version": "1.17.1",
                    "size": "43.1 MB",
                    "release": "Tuesday, July 06 2021"
                },
                {
                    "version": "1.17",
                    "size": "43.0 MB",
                    "release": "Friday, June 11 2021"
                },
                {
                    "version": "1.16.5",
                    "size": "34.18 MB",
                    "release": "Sunday, January 17 2021"
                },
                {
                    "version": "1.16.4",
                    "size": "34.13 MB",
                    "release": "Thursday, October 29 2020"
                },
                {
                    "version": "1.16.3",
                    "size": "34.11 MB",
                    "release": "Tuesday, September 15 2020"
                },
                {
                    "version": "1.16.2",
                    "size": "34.06 MB",
                    "release": "Wednesday, August 12 2020"
                },
                {
                    "version": "1.16.1",
                    "size": "34.01 MB",
                    "release": "Wednesday, June 24 2020"
                },
                {
                    "version": "1.15.2",
                    "size": "30.98 MB",
                    "release": "Tuesday, January 21 2020"
                },
                {
                    "version": "1.15.1",
                    "size": "30.8 MB",
                    "release": "Tuesday, December 17 2019"
                },
                {
                    "version": "1.15",
                    "size": "30.8 MB",
                    "release": "Tuesday, December 10 2019"
                },
                {
                    "version": "1.14.4",
                    "size": "30.5 MB",
                    "release": "Friday, July 19 2019"
                },
                {
                    "version": "1.14.3",
                    "size": "30.31 MB",
                    "release": "Monday, June 24 2019"
                },
                {
                    "version": "1.14.2",
                    "size": "30.28 MB",
                    "release": "Monday, May 27 2019"
                },
                {
                    "version": "1.14.1",
                    "size": "30.43 MB",
                    "release": "Wednesday, May 15 2019"
                },
                {
                    "version": "1.14",
                    "size": "30.31 MB",
                    "release": "Sunday, April 28 2019"
                },
                {
                    "version": "1.13.2",
                    "size": "45.09 MB",
                    "release": "Tuesday, October 23 2018"
                },
                {
                    "version": "1.13.1",
                    "size": "44.73 MB",
                    "release": "Monday, August 27 2018"
                },
                {
                    "version": "1.13",
                    "size": "43.71 MB",
                    "release": "Sunday, July 22 2018"
                },
                {
                    "version": "1.12.2",
                    "size": "41.14 MB",
                    "release": "Monday, September 18 2017"
                },
                {
                    "version": "1.12.1",
                    "size": "40.54 MB",
                    "release": "Friday, August 04 2017"
                },
                {
                    "version": "1.12",
                    "size": "40.15 MB",
                    "release": "Wednesday, June 07 2017"
                },
                {
                    "version": "1.11.2",
                    "size": "23.41 MB",
                    "release": "Thursday, May 18 2017"
                },
                {
                    "version": "1.11.1",
                    "size": "21.67 MB",
                    "release": "Wednesday, December 21 2016"
                },
                {
                    "version": "1.11",
                    "size": "21.66 MB",
                    "release": "Tuesday, December 20 2016"
                },
                {
                    "version": "1.10.2",
                    "size": "20.12 MB",
                    "release": "Wednesday, November 16 2016"
                },
                {
                    "version": "1.10",
                    "size": "20.1 MB",
                    "release": "Sunday, June 26 2016"
                },
                {
                    "version": "1.9.4",
                    "size": "20.02 MB",
                    "release": "Thursday, June 09 2016"
                },
                {
                    "version": "1.9.2",
                    "size": "19.56 MB",
                    "release": "Wednesday, March 30 2016"
                },
                {
                    "version": "1.9",
                    "size": "19.48 MB",
                    "release": "Monday, February 29 2016"
                },
                {
                    "version": "1.8.8",
                    "size": "18.84 MB",
                    "release": "Tuesday, July 28 2015"
                },
                {
                    "version": "1.8.7",
                    "size": "20.57 MB",
                    "release": "Friday, June 05 2015"
                },
                {
                    "version": "1.8.6",
                    "size": "20.55 MB",
                    "release": "Monday, May 25 2015"
                },
                {
                    "version": "1.8.5",
                    "size": "20.56 MB",
                    "release": "Friday, May 22 2015"
                },
                {
                    "version": "1.8.4",
                    "size": "20.53 MB",
                    "release": "Friday, April 17 2015"
                },
                {
                    "version": "1.8.3",
                    "size": "20.55 MB",
                    "release": "Friday, February 20 2015"
                },
                {
                    "version": "1.8",
                    "size": "18.81 MB",
                    "release": "Saturday, August 02 2014"
                },
                {
                    "version": "1.7.10",
                    "size": "19.66 MB",
                    "release": "Thursday, June 26 2014"
                },
                {
                    "version": "1.7.9",
                    "size": "21.99 MB",
                    "release": "Monday, April 14 2014"
                },
                {
                    "version": "1.7.8",
                    "size": "21.98 MB",
                    "release": "Friday, April 11 2014"
                },
                {
                    "version": "1.7.5",
                    "size": "22.35 MB",
                    "release": "Wednesday, February 26 2014"
                },
                {
                    "version": "1.7.2",
                    "size": "21.51 MB",
                    "release": "Friday, October 25 2013"
                },
                {
                    "version": "1.6.4",
                    "size": "20.6 MB",
                    "release": "Thursday, September 19 2013"
                },
                {
                    "version": "1.6.2",
                    "size": "18.65 MB",
                    "release": "Monday, July 08 2013"
                },
                {
                    "version": "1.5.2",
                    "size": "16.62 MB",
                    "release": "Thursday, May 02 2013"
                },
                {
                    "version": "1.5.1",
                    "size": "15.86 MB",
                    "release": "Thursday, March 21 2013"
                },
                {
                    "version": "1.4.7",
                    "size": "15.48 MB",
                    "release": "Wednesday, January 09 2013"
                },
                {
                    "version": "1.4.6",
                    "size": "14.11 MB",
                    "release": "Thursday, December 20 2012"
                }
            ]
        },
        {
            platform: "bukkit",
            jars: [
                {
                    "version": "1.19.4",
                    "release": "Tuesday, March 14 2023",
                    "size": "67.6 MB"
                },
                {
                    "version": "1.19.3",
                    "release": "Wednesday, December 07 2022",
                    "size": "64.3 MB"
                },
                {
                    "version": "1.19.2",
                    "release": "Friday, August 05 2022",
                    "size": "63.7 MB"
                },
                {
                    "version": "1.19.1",
                    "release": "Wednesday, July 27 2022",
                    "size": "63.7 MB"
                },
                {
                    "version": "1.19",
                    "release": "Tuesday, June 07 2022",
                    "size": "63.6 MB"
                },
                {
                    "version": "1.18.2",
                    "release": "Sunday, March 06 2022",
                    "size": "64.5 MB"
                },
                {
                    "version": "1.18.1",
                    "release": "Friday, December 10 2021",
                    "size": "64.2 MB"
                },
                {
                    "version": "1.18",
                    "release": "Tuesday, November 30 2021",
                    "size": "64.2 MB"
                },
                {
                    "version": "1.17.1",
                    "release": "Tuesday, July 06 2021",
                    "size": "42.8 MB"
                },
                {
                    "version": "1.17",
                    "release": "Friday, June 11 2021",
                    "size": "42.7 MB"
                },
                {
                    "version": "1.16.5",
                    "release": "Sunday, January 17 2021",
                    "size": "33.92 MB"
                },
                {
                    "version": "1.16.4",
                    "release": "Thursday, October 29 2020",
                    "size": "33.87 MB"
                },
                {
                    "version": "1.16.3",
                    "release": "Tuesday, September 15 2020",
                    "size": "33.85 MB"
                },
                {
                    "version": "1.16.2",
                    "release": "Wednesday, August 12 2020",
                    "size": "33.8 MB"
                },
                {
                    "version": "1.16.1",
                    "release": "Wednesday, June 24 2020",
                    "size": "33.8 MB"
                },
                {
                    "version": "1.15.2",
                    "release": "Tuesday, January 21 2020",
                    "size": "30.74 MB"
                },
                {
                    "version": "1.15.1",
                    "release": "Tuesday, December 17 2019",
                    "size": "30.6 MB"
                },
                {
                    "version": "1.15",
                    "release": "Tuesday, December 10 2019",
                    "size": "30.62 MB"
                },
                {
                    "version": "1.14.4",
                    "release": "Friday, July 19 2019",
                    "size": "30.33 MB"
                },
                {
                    "version": "1.14.3",
                    "release": "Saturday, July 13 2019",
                    "size": "30.15 MB"
                },
                {
                    "version": "1.14.2",
                    "release": "Monday, May 27 2019",
                    "size": "30.08 MB"
                },
                {
                    "version": "1.14.1",
                    "release": "Wednesday, May 15 2019",
                    "size": "30.24 MB"
                },
                {
                    "version": "1.14",
                    "release": "Sunday, April 28 2019",
                    "size": "30.12 MB"
                },
                {
                    "version": "1.13.2",
                    "release": "Tuesday, October 23 2018",
                    "size": "42.45 MB"
                },
                {
                    "version": "1.13.1",
                    "release": "Monday, August 27 2018",
                    "size": "42.09 MB"
                },
                {
                    "version": "1.13",
                    "release": "Sunday, July 22 2018",
                    "size": "41.08 MB"
                },
                {
                    "version": "1.12.2",
                    "release": "Monday, September 18 2017",
                    "size": "38.51 MB"
                },
                {
                    "version": "1.12.1",
                    "release": "Friday, August 04 2017",
                    "size": "37.92 MB"
                },
                {
                    "version": "1.12",
                    "release": "Wednesday, June 07 2017",
                    "size": "37.53 MB"
                },
                {
                    "version": "1.11.2",
                    "release": "Thursday, May 18 2017",
                    "size": "20.79 MB"
                },
                {
                    "version": "1.11.1",
                    "release": "Wednesday, December 21 2016",
                    "size": "19.06 MB"
                },
                {
                    "version": "1.11",
                    "release": "Tuesday, December 20 2016",
                    "size": "19.05 MB"
                },
                {
                    "version": "1.10.2",
                    "release": "Wednesday, November 16 2016",
                    "size": "17.51 MB"
                },
                {
                    "version": "1.10",
                    "release": "Sunday, June 26 2016",
                    "size": "17.49 MB"
                },
                {
                    "version": "1.9.4",
                    "release": "Thursday, June 09 2016",
                    "size": "17.41 MB"
                },
                {
                    "version": "1.9.2",
                    "release": "Wednesday, March 30 2016",
                    "size": "16.95 MB"
                },
                {
                    "version": "1.9",
                    "release": "Monday, February 29 2016",
                    "size": "16.95 MB"
                },
                {
                    "version": "1.8.8",
                    "release": "Tuesday, July 28 2015",
                    "size": "16.19 MB"
                },
                {
                    "version": "1.8.7",
                    "release": "Friday, June 05 2015",
                    "size": "17.96 MB"
                },
                {
                    "version": "1.8.6",
                    "release": "Monday, May 25 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8.5",
                    "release": "Friday, May 22 2015",
                    "size": "17.96 MB"
                },
                {
                    "version": "1.8.4",
                    "release": "Friday, April 17 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8.3",
                    "release": "Friday, February 20 2015",
                    "size": "17.95 MB"
                },
                {
                    "version": "1.8",
                    "release": "Tuesday, September 02 2014",
                    "size": "18.63 MB"
                },
                {
                    "version": "1.7.10",
                    "release": "Thursday, June 26 2014",
                    "size": "19.52 MB"
                },
                {
                    "version": "1.7.9",
                    "release": "Monday, April 14 2014",
                    "size": "19.51 MB"
                },
                {
                    "version": "1.7.8",
                    "release": "Friday, April 11 2014",
                    "size": "19.5 MB"
                },
                {
                    "version": "1.7.5",
                    "release": "Wednesday, February 26 2014",
                    "size": "19.06 MB"
                },
                {
                    "version": "1.7.2",
                    "release": "Friday, October 25 2013",
                    "size": "19.05 MB"
                },
                {
                    "version": "1.6.4",
                    "release": "Thursday, September 19 2013",
                    "size": "14.59 MB"
                },
                {
                    "version": "1.6.2",
                    "release": "Monday, July 08 2013",
                    "size": "14.56 MB"
                },
                {
                    "version": "1.6.1",
                    "release": "Monday, July 01 2013",
                    "size": "14.53 MB"
                },
                {
                    "version": "1.5.2",
                    "release": "Thursday, May 02 2013",
                    "size": "12.37 MB"
                },
                {
                    "version": "1.5.1",
                    "release": "Thursday, March 21 2013",
                    "size": "12.36 MB"
                },
                {
                    "version": "1.5",
                    "release": "Wednesday, March 13 2013",
                    "size": "12.29 MB"
                },
                {
                    "version": "1.4.7",
                    "release": "Wednesday, January 09 2013",
                    "size": "12.02 MB"
                },
                {
                    "version": "1.4.6",
                    "release": "Thursday, December 20 2012",
                    "size": "14.22 MB"
                },
                {
                    "version": "1.4.5",
                    "release": "Tuesday, November 20 2012",
                    "size": "14.35 MB"
                },
                {
                    "version": "1.4.2",
                    "release": "Thursday, October 25 2012",
                    "size": "11.49 MB"
                },
                {
                    "version": "1.3.2",
                    "release": "Thursday, August 16 2012",
                    "size": "11.19 MB"
                },
                {
                    "version": "1.3.1",
                    "release": "Wednesday, August 01 2012",
                    "size": "11.18 MB"
                },
                {
                    "version": "1.2.5",
                    "release": "Wednesday, April 04 2012",
                    "size": "10.71 MB"
                },
                {
                    "version": "1.2.4",
                    "release": "Thursday, March 22 2012",
                    "size": "10.58 MB"
                },
                {
                    "version": "1.2.3",
                    "release": "Friday, March 02 2012",
                    "size": "10.58 MB"
                },
                {
                    "version": "1.2.2",
                    "release": "Thursday, March 01 2012",
                    "size": "10.53 MB"
                },
                {
                    "version": "1.1",
                    "release": "Thursday, January 12 2012",
                    "size": "10.3 MB"
                },
                {
                    "version": "1.0.0",
                    "release": "Friday, November 18 2011",
                    "size": "9.32 MB"
                }
            ]
        }
    ]
</script>

<div class="place-items-center text-center items-start grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Type</h3>
        <select bind:value={selectedType} id="type" class="w-[100px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="paper" class="bg-red-500">Paper</option>
            <option value="spigot">Spigot</option>
            <option value="bukkit">Bukkit</option>
        </select>
    </div>
    <div class="flex flex-col">
        <h3 class="font-medium text-white text-[20px] text-left">Version</h3>
        <select id="underline_select2" class="w-[100px] py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-200 text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
            <option value="spadwigot" class="bg-[#3C414B] text-gray-400 hover:text-white hover:bg-[#626875]">1.19.4</option>
            <option value="bukdkit">1.19.3</option>
            <option value="papedwr">1.19.2</option>
        </select>
    </div>
    <button class="button h-fit self-center">Download</button>
</div>

<table class="w-[60%] text-white mt-12">
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