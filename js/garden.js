function Vector(a, b) {
	this.x = a;
	this.y = b
}

Vector.prototype = {
	rotate: function (b) {
		var a = this.x;
		var c = this.y;
		this.x = Math.cos(b) * a - Math.sin(b) * c;
		this.y = Math.sin(b) * a + Math.cos(b) * c;
		return this
	}, mult: function (a) {
		this.x *= a;
		this.y *= a;
		return this
	}, clone: function () {
		return new Vector(this.x, this.y)
	}, length: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}, subtract: function (a) {
		this.x -= a.x;
		this.y -= a.y;
		return this
	}, set: function (a, b) {
		this.x = a;
		this.y = b;
		return this
	}
};

function Petal(a, f, b, e, c, d) {
	this.stretchA = a;
	this.stretchB = f;
	this.startAngle = b;
	this.angle = e;
	this.bloom = d;
	this.growFactor = c;
	this.r = 1;
	this.isfinished = false
}

Petal.prototype = {
	draw: function () {
		var a = this.bloom.garden.ctx;
		var e, d, c, b;
		e = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
		d = e.clone().rotate(Garden.degrad(this.angle));
		c = e.clone().mult(this.stretchA);
		b = d.clone().mult(this.stretchB);
		a.strokeStyle = this.bloom.c;
		a.beginPath();
		a.moveTo(e.x, e.y);
		a.bezierCurveTo(c.x, c.y, b.x, b.y, d.x, d.y);
		a.stroke()
	}, render: function () {
		if (this.r <= this.bloom.r) {
			this.r += this.growFactor;
			this.draw()
		} else {
			this.isfinished = true
		}
	}
};

function Bloom(e, d, f, a, b) {
	this.p = e;
	this.r = d;
	this.c = f;
	this.pc = a;
	this.petals = [];
	this.garden = b;
	this.init();
	this.garden.addBloom(this)
}

Bloom.prototype = {
	draw: function () {
		var c, b = true;
		this.garden.ctx.save();
		this.garden.ctx.translate(this.p.x, this.p.y);
		for (var a = 0; a < this.petals.length; a++) {
			c = this.petals[a];
			c.render();
			b *= c.isfinished
		}
		this.garden.ctx.restore();
		if (b == true) {
			this.garden.removeBloom(this)
		}
	}, init: function () {
		var c = 360 / this.pc;
		var b = Garden.randomInt(0, 90);
		for (var a = 0; a < this.pc; a++) {
			this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), b + a * c, c, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this))
		}
	}
};

function Garden(a, b) {
	this.blooms = [];
	this.element = b;
	this.ctx = a
}

Garden.prototype = {
	render: function () {
		for (var a = 0; a < this.blooms.length; a++) {
			this.blooms[a].draw()
		}
	}, addBloom: function (a) {
		this.blooms.push(a)
	}, removeBloom: function (a) {
		var d;
		for (var c = 0; c < this.blooms.length; c++) {
			d = this.blooms[c];
			if (d === a) {
				this.blooms.splice(c, 1);
				return this
			}
		}
	}, createRandomBloom: function (a, b) {
		this.createBloom(a, b, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.rmin, Garden.options.color.rmax, Garden.options.color.gmin, Garden.options.color.gmax, Garden.options.color.bmin, Garden.options.color.bmax, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max))
	}, createBloom: function (a, f, d, e, b) {
		new Bloom(new Vector(a, f), d, e, b, this)
	}, clear: function () {
		this.blooms = [];
		this.ctx.clearRect(0, 0, this.element.width, this.element.height)
	}
};
Garden.options = {
	petalCount: { min: 8, max: 15 },
	petalStretch: { min: 0.1, max: 3 },
	growFactor: { min: 0.1, max: 1 },
	bloomRadius: { min: 8, max: 10 },
	density: 10,
	growSpeed: 1000 / 60,
	color: { rmin: 0, rmax: 128, gmin: 0, gmax: 128, bmin: 128, bmax: 255, opacity: 0.1 },
	tanAngle: 60
};
Garden.random = function (b, a) {
	return Math.random() * (a - b) + b
};
Garden.randomInt = function (b, a) {
	return Math.floor(Math.random() * (a - b + 1)) + b
};
Garden.circle = 2 * Math.PI;
Garden.degrad = function (a) {
	return Garden.circle / 360 * a
};
Garden.raddeg = function (a) {
	return a / Garden.circle * 360
};
Garden.rgba = function (f, e, c, d) {
	return "rgba(" + f + "," + e + "," + c + "," + d + ")"
};
Garden.randomrgba = function (i, n, h, m, l, d, k) {
	var c = Math.round(Garden.random(i, n));
	var f = Math.round(Garden.random(h, m));
	var j = Math.round(Garden.random(l, d));
	var e = 5;
	if (Math.abs(c - f) <= e && Math.abs(f - j) <= e && Math.abs(j - c) <= e) {
		return Garden.rgba(i, n, h, m, l, d, k)
	} else {
		return Garden.rgba(c, f, j, k)
	}
};