const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']

/* takes an array of UVA class codes
 *
 * returns an array of objects that, as described in schedule.js,
 * represent all meeting times of the given classes
*/
function promiseSchedule(classCodes)
{
	if (!classCodes || classCodes.length == 0)
		return []

	return Promise.all(classCodes.map(promiseClass))
		.then(talss => talss.flat().filter(tal => tal))
}

/* takes a UVA class code (e.g. 12345)
 *
 * returns an array of objects that, as described in schedule.js,
 * represent the meeting times of the given class
*/
async function promiseClass(classCode)
{
	const text = await scurl("https://louslist.org/sectiontip.php?ClassNumber=" + classCode)

	const [, title] = text.match(/class="InfoClass">(.*)<br/)

	return [...text.matchAll(/<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g)].map(([, timedow, loc]) => {

		const times = timedow.match(/\d+:\d+(am|pm)/ig)

		if (!times)
			return null

		return {
			title: title,
			loc:   loc,
			dows:  timedow.toLowerCase()
				.match(/mo|we|fr|tu|th|sa|su/g)
				.map(dow => days.indexOf(dow)),
			start: toHRT(times[0]),
			end:   toHRT(times[1])
		}

	})
}

/* takes a 12-hour time string
 * returns a float that represents the time in hours (referred to as an HRT)
 *
 * "8:30PM" -> 20.5
*/
function toHRT(text)
{
	const [hours, mins] = text.match(/\d+/g).map(n => Number(n))
	const ampm          = text.match(/pm/ig) ? 12 : 0

	return (ampm + hours % 12) + mins / 60
}

/* takes a url
 * returns the text GET response of the url
*/
async function scurl(url)
{
	return fetch('https://www.cs.virginia.edu/~jh7qbe/test.php?url=' + encodeURIComponent(url))
		.then(resp => resp.text())
}

export { promiseSchedule }