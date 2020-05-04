/*

item object:

[{
	title: 'My Item Title'
	loc: 'Olsson 009',
	start: 8.5,
	end: 10,
	dows: [1, 3, 5]
}, ...]

mowefr
8:30-10 Calculus at Olsson 009

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
	const lines = chunkText.split('\n')

	// temporary fix?
	if (!lines[0].match(/(mo|we|fr|tu|th|sa|su)+/gi))
		return null
	
	const dows = lines[0].toLowerCase()
		.match(/mo|we|fr|tu|th|sa|su/g)
		.map(dow => days.indexOf(dow))
	
	return lines.slice(1).map(line => {
		
		const groups = line.match(/(.+?)-(.+?)\s+(.+?)(?= at (.+)|$)/i)
		
		return {
			start: parseHours(groups[1]),
			end:   parseHours(groups[2]),
			title: groups[3],
			loc:   groups[4]? groups[4] : 'unknown',
			dows:  dows
		}
	})
}

function parseHours(string)
{
	const groups = string.toLowerCase().match(/(\d{1,2}):?(\d{0,2})?(am|pm)?/)
	const hours  = parseFloat(groups[1])
	const mins   = groups[2]? parseFloat(groups[2]) : 0
	const ampm   = groups[3]
	
	return mins/60 + (ampm? hours % 12 : hours) + (ampm? (ampm === 'pm'? 12 : 0) : 0)
}

function getTextSchedule(schedule)
{
	console.log(schedule)
	let append = ''
	for (tal of schedule)
		append += `${tal.dows.map(i => days[i]).join('')}\n${to24Hour(tal.start)}-${to24Hour(tal.end)} ${tal.title} at ${tal.loc}\n\n`
	return append
}

function to24Hour(hrt)
{
	let hours = Math.floor(hrt)
	let minutes = Math.round(60 * (hrt - hours))
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}