/// note: uses the following from schedule.js
/// const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']

function promiseSchedule(classCodes)
{
	return new Promise(resolve => {
		if (!classCodes || classCodes.length == 0) {
			resolve('')
			return
		}

		Promise.all(classCodes.map(code => promiseClass(code)))
			.then(talss => resolve(talss.flat().filter(tal => tal)))
	})
}

function promiseClass(classCode, pfunc)
{
	return new Promise(resolve =>
		scurl("https://louslist.org/sectiontip.php?ClassNumber=" + classCode).then(text => {
			const title = text.match(/(class="InfoClass">)(.*)(<br)/)[2]
			const tals = Array.from(text.matchAll(/(?<=\/td><td>)(.*?)(?:<\/td><td>)(.*?)(?=<\/td><\/tr>)/g)).map(groups => {

				let timedow  = groups[1].toLowerCase()
				let location = groups[2]

				let times = timedow.match(/\d+:\d+(?:am|pm)/g)

				if (!times)
					return null

				return {
					title: title,
					loc:   location,
					dows:  timedow.match(/mo|tu|we|th|fr|sa|su/g).map(name => days.indexOf(name)),
					start: toHRT(times[0]),
					end:   toHRT(times[1])
				}

			})

			resolve(tals)
		})
	)
}

/* takes a 12-hour time string
 * returns a float that represents the time in hours (referred to as an HRT)
 *
 * "8:30PM" -> 20.5
*/
function toHRT(text)
{
	const nums = text.match(/\d+/g).map(n => Number(n))
	const ampm = text.toLowerCase().match(/am|pm/g)[0] === 'pm' ? 12 : 0

	return (ampm + nums[0] % 12) + nums[1] / 60
}

/* takes a url and a function
 * runs the function with the url's response text
*/
function scurl(url)
{
	return new Promise(resolve =>
		fetch('https://simplecorsworkaround.herokuapp.com/?url=' + encodeURIComponent(url))
			.then(resp => resp.text())
			.then(text => resolve(text))
	)
}