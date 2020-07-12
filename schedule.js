/*

-- example of single item --

mowefr
8:30-10 Calculus at Olsson 009

{
	title: 'Calculus'
	loc: 'Olsson 009',
	start: 8.5,
	end: 10,
	dows: [1, 3, 5]
}

*/

const days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']

/** takes text representing some items in format
 **
 ** mowefr
 ** 8:30-10 Calculus at Olsson 009
 ** 11-12   Lunch
 **
 ** tu
 ** 12-15:45 eat
 **
 ** and returns a list of items
 */
function parseSchedule(text)
{
	return text.split('\n\n')
		.filter(chunk => chunk)
		.flatMap(chunk => parseChunk(chunk))
		.filter(parsed => parsed)
}

/** takes text separated by single newlines
 ** text is in following format:
 **
 ** mowefr
 ** 8:30-10 Calculus at Olsson 009
 ** 11-12   Lunch
 **
 ** and returns its representative items
 */
function parseChunk(chunkText)
{
	const [header, ...lines] = chunkText.split('\n')

	// temporary fix?
	if (!header.match(/(mo|we|fr|tu|th|sa|su)+/ig))
		return null

	const dows = header.toLowerCase()
		.match(/mo|we|fr|tu|th|sa|su/g)
		.map(dow => days.indexOf(dow))

	return lines
		.map(line => line.match(/(.+?)-(.+?)\s+(.+?)(?= at (.+)|$)/))
		.filter(x => x)
		.map(([, start, end, title, loc]) => ({
			title: title,
			dows:  dows,
			loc:   loc || 'unknown',
			start: parseHours(start),
			end:   parseHours(end)
		}))
}

function parseHours(string)
{
	let [hours, mins=0] = string.match(/\d{1,2}/g).map(num => Number(num))

	if (string.match(/am|pm/i))
		hours %= 12

	if (string.match(/pm/i))
		hours += 12

	return hours + mins / 60
}

function getTextSchedule(schedule)
{
	return schedule
		.map(({title, dows, loc, start, end}) =>
			`${dows.map(i => days[i]).join('')}\n${[start, end].map(to24Hour).join('-')} ${title} at ${loc}`)
		.join('\n\n')
}

function to24Hour(hrt)
{
	const hours = Math.floor(hrt)
	const mins  = Math.round(hrt % 1 * 60)

	return [hours, mins]
		.map(num => num.toString().padStart(2, '0'))
		.join(':')
}