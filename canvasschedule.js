const default_settings = {
	padding: 20,
	marginX: 50,
	marginY: 50,
	startHour: 8,
	endHour: 18,
	blockWidth: 100,
	blockHeight: 60,
	foreground: '#000',
	background: '#fff',
	textground: '#000',
	font: '12px Arial',
	guideOpacity: 0.1,
	lineHeight: 14,
	textPadding: 4,
	shortDays: 'mo,tu,we,th,fr',
	longDays: 'Mon,Tue,Wed,Thu,Fri',
	dowOffset: 1
}

const new_canvasschedule =
	(canvas_selector, new_settings={}) =>
{
	const s = {...default_settings, ...new_settings}

	s.longDays  = s.longDays.split(',')
	s.shortDays = s.shortDays.split(',')

	const can = document.querySelector(canvas_selector)
	const c   = can.getContext('2d')

	can.width  = s.padding*2 + s.marginX + s.longDays.length * s.blockWidth
	can.height = s.padding*2 + s.marginY + (s.endHour - s.startHour + 1) * s.blockHeight

	can.parentElement.style.width  = can.width
	can.parentElement.style.height = can.height

	c.globalAlpha  = 1
	c.font         = s.font
	c.strokeStyle  = s.foreground
	c.textAlign    = 'center'
	c.textBaseline = 'middle'

	s.canvas = can
	s.c      = c

	s.draw_text     = draw_text(s)
	s.draw_textrect = draw_textrect(s)
	s.draw_outline  = draw_outline(s)

	s.draw_outline()

	return draw_schedule(s)
}

const draw_schedule =
	({
		draw_outline, draw_textrect,
		blockWidth, blockHeight,
		startHour, dowOffset
	}) => schedule =>
{
	draw_outline()

	// draw items
	for (const { dows, start, end, title } of schedule)
		for (const dow of dows)
			draw_textrect
				((dow - dowOffset) * blockWidth, (start - startHour) * blockHeight)
				(blockWidth, (end - start) * blockHeight)
				(title)
}

const draw_outline =
	({
		draw_textrect,
		longDays,
		startHour, endHour,
		background, guideOpacity,
		padding, marginX, marginY,
		blockHeight, blockWidth,
		c, canvas: { width, height }
	}) => () =>
{
	c.fillStyle = background
	c.fillRect(0, 0, width, height)

	// draw lines
	c.globalAlpha = guideOpacity
	for (let hour = startHour + 1; hour <= endHour; ++hour)
		c.strokeRect(
			padding + marginX,
			padding + marginY + (hour - startHour) * blockHeight,
			width - marginY - padding * 2,
			0
		)
	c.globalAlpha = 1

	// draw DOWs
	for (let day = 0; day < longDays.length; ++day)
		draw_textrect
			(blockWidth * day, -marginY)
			(blockWidth, marginY)
			(longDays[day])

	// draw times
	for (let hour = startHour; hour <= endHour; ++hour)
		draw_textrect
			(-marginX, (hour - startHour) * blockHeight)
			(marginX, blockHeight)
			(hour.toString())
}

const draw_textrect =
	({
		draw_text,
		background, foreground, textground,
		padding, textPadding,
		marginX, marginY,
		c
	}) => (x, y) => (width, height) => text =>
{
	x += padding + marginX
	y += padding + marginY

	c.strokeStyle = foreground
	c.fillStyle   = background
	c.fillRect(x, y, width, height)
	c.strokeRect(x, y, width, height)

	c.fillStyle = textground;

	draw_text
		(x + width/2, y + height/2)
		(wrapped(c)(width - textPadding*2)(text))
}

const draw_text =
	({ c, lineHeight: lh }) => (centerX, centerY) => text =>
{
	const lines = text.split('\n')

	const topY = centerY + lh * (1 - lines.length) / 2

	for (let i = 0; i < lines.length; ++i)
		c.fillText(lines[i], centerX, topY + lh * i)
}

const wrapped =
	c => max_width => text =>
{
	const words = text.match(/\S+/g)

	if (!words)
		return ''

	return words.reduce((lines, word) => {

		const old   = lines.pop()
		const nieuw = `${old} ${word}`

		return c.measureText(nieuw).width <= max_width
			? [...lines, nieuw]
			: [...lines, old, word]

	}, [words.shift()]).join('\n')
}