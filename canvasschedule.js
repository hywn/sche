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

class ScheduleCanvas
{
	constructor(canvasID, new_settings={})
	{
		const settings = {...default_settings}

		Object.entries(new_settings)
			.forEach(([k, v]) => settings[k] = v)

		Object.entries(settings)
			.forEach(([k, v]) => this[k] = v)

		this.longDays  = this.longDays.split(',')
		this.shortDays = this.shortDays.split(',')

		const can = this.canvas = document.getElementById(canvasID)
		const c   = this.c      = can.getContext('2d')

		can.width  = this.padding*2 + this.marginX + this.longDays.length * this.blockWidth
		can.height = this.padding*2 + this.marginY + (this.endHour - this.startHour + 1) * this.blockHeight

		can.parentElement.style.width  = can.width
		can.parentElement.style.height = can.height

		c.globalAlpha  = 1
		c.font         = this.font
		c.strokeStyle  = this.foreground
		c.textAlign    = 'center'
		c.textBaseline = 'middle'

		this.drawSchedule([])
	}

	drawSchedule(schedule)
	{
		const {
			marginX, marginY, padding, blockWidth, blockHeight,
			startHour, endHour,
			c
		} = this

		c.fillStyle = this.background
		c.fillRect(0, 0, this.canvas.width, this.canvas.height)

		// draw lines
		c.globalAlpha = this.guideOpacity
		for (let hour = startHour + 1; hour <= endHour; ++hour)
			c.strokeRect(
				padding + marginX,
				padding + marginY + (hour - startHour) * blockHeight,
				this.canvas.width - marginY - padding * 2,
				0
			)
		c.globalAlpha = 1

		// draw DOWs
		for (let day = 0; day < this.longDays.length; ++day)
			this.drawTextRect(
				this.longDays[day],
				padding + marginX + blockWidth * day,
				padding,
				blockWidth,
				marginY
			)

		// draw times
		for (let hour = startHour; hour <= endHour; ++hour)
			this.drawTextRect(
				hour.toString(),
				padding,
				padding + marginY + (hour - startHour) * blockHeight,
				marginX,
				blockHeight
			)

		// draw items
		for (const item of schedule)
			for (const dow of item.dows)
				this.drawTextRect(
					item.title,
					padding + marginX + (dow - this.dowOffset) * blockWidth,
					padding + marginY + (item.start - startHour) * blockHeight,
					blockWidth,
					(item.end - item.start) * blockHeight
				)
	}

	drawTextRect(text, x, y, width, height)
	{
		const { c, background, foreground, textground } = this

		c.strokeStyle = foreground
		c.fillStyle   = background
		c.fillRect(x, y, width, height)
		c.strokeRect(x, y, width, height)

		c.fillStyle = textground;

		this.drawText(
			this.wrapped(text, width - this.textPadding*2),
			x + width/2,
			y + height/2
		)
	}

	drawText(text, centerX, centerY)
	{
		const { lineHeight: lh } = this

		const lines = text.split('\n')

		const topY = centerY + lh * (1 - lines.length) / 2

		for (let i = 0; i < lines.length; ++i)
			this.c.fillText(lines[i], centerX, topY + lh * i)
	}

	wrapped(text, max_width)
	{
		const words = text.match(/\S+/g)

		if (!words)
			return ''

		return words.reduce((lines, word) => {

			const appended = `${lines[lines.length - 1]} ${word}`

			if (this.c.measureText(appended).width <= max_width)
				lines[lines.length - 1] = appended
			else
				lines.push(word)

			return lines

		}, [words.shift()]).join('\n')
	}
}