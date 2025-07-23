/*
	should be fun to figure out how the final values are calculated ;P
	the first number in arrays and nestings represents their value
	the numbers after that represent their position

	stored as number up to and including 2**53
	the base function is 2**x
	zeroes in the array are not allowed
	the array must start with [53, 1]
	[n, 1] is not allowed in nestings
	each number must have a higher position in nestings
	successive numbers cant come after positional arrays in nestings
	Infinity indicates a precision cutoff

	the limit is roughly f_ε_0(precision) in fast growing function hierarchy
*/

/* omg so confusing!! lawl x3 */
$big = {
	/* max length of the array */
	prec: 16,
	con: a =>
		a == Infinity ? [Infinity] :
		typeof(a) == "number" ?
			a <= 2**53 ? a : [Math.log2(a, 2), 1] : a,
	cmp: (a, b) =>
		typeof(a) == "number" ? typeof(b) == "number" ? Math.sign(a - b) : -1 :
		typeof(b) == "number" ? 1 :
		((f, x) => f(f, x))((f, [a, b]) =>
			a.reduceRight(
				(sign, aNext, ai) =>
					sign || (bi =>
						ai == 0 ?
							bi == 0 ?
								Math.sign(a[0] - b[0]) || 0 :
							a[0] == Infinity ? 1 : -1 :
						bi == 0 ? b[0] == Infinity ? -1 : 1 :
						(bNext =>
							((aNext, bNext) =>
								aNext.length == 2 && aNext[1] == 1 &&
								bNext.length == 2 && bNext[1] == 1 ?
									Math.sign(aNext[0] - bNext[0]) :
									f(f, [aNext, bNext])
							)(
								(aNext =>
									typeof(aNext) == "number" ? [aNext, ai] : aNext
								)(aNext),
								(bNext =>
									typeof(bNext) == "number" ? [bNext, bi] : bNext
								)(bNext)
							)
						)(b[bi])
					)(b.length + ai - a.length),
				0
			),
			[a, b]
		),
	len: x =>
		((f, x) => f(f, x))(((f, x) =>
			typeof(x) == "object" ? x.reduce((n, x) => n + f(f, x), 0) : 1
		), x),
	cpy: x =>
		((f, x) => f(f, x))((f, x) =>
			x.map(x => typeof(x) == "object" ? f(f, x) : x),
		x),
	trim: x =>
		$big.len(x) <= $big.prec ? x : ((f, x) => f(f, x))((f, [x, n]) =>
			x.reduceRight(([x, n], e, i) =>
				i == 0 ?
					(x.push(Infinity), x) :
				(e =>
					(len =>
						n + len <= $big.prec ?
							(x.push(e), [x, n + len]) :
						len == 1 ? [x, Infinity] :
						(e => (
							$big.len(e) > 1 && (x.length == 0 || $big.lt(e, x.at(-1))) &&
								x.push(e),
							[x, Infinity]
						))(f(f, [e, n + 1]))
					)($big.len(e))
				)(typeof(e) == "number" ? i == 1 ? e : [e, i] : e)
			, [[], n]).toReversed()
		, [x, 1]),
	gsp: (a, b) =>
		$big.cmp(a, b) == -1 ? [b, a] : [a, b],
	gte: (a, b) =>
		$big.cmp(a, b) >= 0,
	gt: (a, b) =>
		$big.cmp(a, b) > 0,
	lte: (a, b) =>
		$big.cmp(a, b) <= 0,
	lt: (a, b) =>
		$big.cmp(a, b) < 0,
	eq: (a, b) =>
		$big.cmp(a, b) == 0,
	neq: (a, b) =>
		$big.cmp(a, b) != 0,
	max: (a, b) =>
		$big.cmp(a, b) == -1 ? b : a,
	min: (a, b) =>
		$big.cmp(a, b) == -1 ? a : b,
	int: a =>
		typeof(a) != "number" || a % 1 == 0,
	neg: a =>
		$big.gte(a, [1024, 1]) ? -Infinity :
			typeof(a) == "number" ? $big.con(-a) : -(2**a[0]),
	abs: a =>
		$big.lt(a, 0) ? $big.con(-a) : a,
	inv: a =>
		$big.gte(a, [1074, 1]) ? 0 :
			typeof(a) == "number" ?
				a > 0 && a <= 2**-1024 ? [-Math.log2(a), 1] : $big.con(1 / a) :
				2**-a[0],
	/* 2**53 >= a >= -2 */
	tet2: a =>
		a <= 4 ? [-Infinity, 0, 1, 2, 4, 16, 65536][a + 2] : [65536, a - 4],
	/* general function for commutative hyperoperators (h = 1 is addition) */
	/* 2**53 >= h >= 0, slog2(a) >= h - 4, slog2(b) >= h - 4 */
	cHyp: (a, h, b, n) =>
		$big.gte(a, [53, 1, 1]) || $big.gte(b, [53, 1, 1]) ?
			h >= 2 && $big.lt(a, $big.tet2(h - 3)) || $big.lt(b, $big.tet2(h - 3)) ?
				$big.tet2(h - 4) :
			n ?
				$big.lt(a, b) ?
					$big.tet2(h - 3) :
				$big.eq(a, b) ?
					$big.tet2(h - 2) :
				a :
			$big.max(a, b) :
		(a =>
			a[1] == 0 ? a[0] : a
		)(((a, b, neg) =>
			(hm =>
				((f, x) => f(f, x))((f, [a, hm]) =>
					hm == 0 ? a :
					a[0] < 53 ? f(f, [[2**a[0], a[1]], hm - 1]) :
					[a[0], a[1] + hm],
				[
					/* h == 0 && !n => a >= b */
					((f, x) => f(f, x))((f, [a, h, b, n]) =>
						h == 0 ?
							a[1] == 0 && b[1] == 0 ?
								!n ?
									[(([a, b]) =>
										a + Math.log1p(2**(b - a)) / Math.log(2)
									)($big.gsp(a[0], b[0])), 0] :
									[a[0] + Math.log1p(-(2**(b[0] - a[0]))) / Math.log(2), 0] :
								!n ? $big.max(a, b) : $big.eq(a, b) ? [-Infinity, 0] : a :
						h == 1 ?
							a[1] == 0 && b[1] == 0 ?
								(x =>
									x != Infinity ?
										x <= 2**53 ? [x, 0] :
											[Math.log2(x), 1] :
										f(f, [
											a, h,
											[b[0] == -Infinity ? 1024 : Math.log2(-b[0]), 1],
											n
										])
								)(!n ? a[0] + b[0] : a[0] - b[0]) :
							a[1] <= 1 && b[1] <= 1 ?
								a[0] >= 0 && b[0] >= 0 ?
									!n || $big.lte(b, a) ? (x =>
										x[0] >= 53 ? [x[0], 1] : [2**x[0], 0]
									)(
										f(f, [
											[a[1] == 0 ? Math.log2(a[0]) : a[0], 0],
											0,
											[b[1] == 0 ? Math.log2(b[0]) : b[0], 0],
											n
										])
									) :
									neg(f(f, [b, 1, a, true])) :
								a[0] < 0 ?
									(x =>
										!n ? x : neg(x)
									)(f([b, h, a, n])) :
								f(f, [a, h, neg(b), !n]) :
							!n ? $big.max(a, b) :
							$big.lt(a, b) ? [-Infinity, 0] : $big.eq(a, b) ? [0, 0] : a :
						h == 2 ?
							(x =>
								a[0] < 0 != b[0] < 0 ? neg(x) : x
							)(
								((a, b) =>
									a[1] == 0 && b[1] == 0 ?
										(x =>
											x != Infinity ?
												x <= 2**53 ? [x, 0] :
													[Math.log2(x), 1] :
												f(f, [
													[Math.log2(a[0]), 1], h, [Math.log2(b[0]), 1], n
												])
										)(!n ? a[0] * b[0] : a[0] / b[0]) :
									(x =>
										x[0] < 53 ? [2**x[0], 0] : [x[0], x[1] + 1]
									)(
										f(f, [
											a[1] == 0 ? [Math.log2(a[0]), 0] : [a[0], a[1] - 1],
											h - 1,
											b[1] == 0 ? [Math.log2(b[0]), 0] : [b[0], b[1] - 1],
											n
										])
									)
								)(
									a[0] < 0 ? [-a[0], 0] : a,
									b[0] < 0 ? [-b[0], 0] : b
								)
							) :
						(x =>
							x[0] < 53 ? [2**x[0], 0] : [x[0], x[1] + 1]
						)(
							f(f, [
								a[1] == 0 ? [Math.log2(a[0]), 0] : [a[0], a[1] - 1],
								h - 1,
								b[1] == 0 ? [Math.log2(b[0]), 0] : [b[0], b[1] - 1],
								n
							])
						),
					[
						[a[0], a[1] - hm],
						h - hm,
						[b[0], b[1] - hm],
						n
					]),
					hm
				])
			)(Math.min(a[1], Math.max(h - 2, 0), b[1]))
		)(
			typeof(a) == "number" ? [a, 0] : a,
			typeof(b) == "number" ? [b, 0] : b,
			x =>
				x[1] > 1 ? [-Infinity, 0] :
				x[1] == 1 ? [-(2**x[0]), 0] :
				x[0] < -(2*53) ? [x[0] == -Infinity ? 1024 : Math.log2(-x[0]), 1] :
				[-x[0], 0]
		)),
	/* typeof(x) != "number", e[0] = 1 */
	addE: (x, e, r) =>
		((x, eb, [l, ln]) =>
			$big.lt(ln, e) ?
				typeof(r) == "number" ? (
					x.push(e.length == 2 && e[1] == 1 ? r : e.map((x, i) =>
						i == 0 ? r : x
					)),
					x
				) :
					$big.addE(r, eb, 1) :
			$big.eq(ln, e) ?
				(lr =>
					typeof(lr) == "number" ? (
						x.pop(),
						x.push(e.length == 2 && e[1] == 1 ? lr : e.map((x, i) =>
							i == 0 ? lr : x
						)),
						x
					) :
						$big.addE(lr, eb, 1)
				)($big.cHyp(l[0], 1, r)) :
			$big.eq(ln, eb) ? (
				x.pop(),
				$big.addE(
					$big.cHyp(x, 1, r),
					ln, l[0]
				)
			) :
				$big.max(x, r)
		)(
			$big.cpy(x),
			e.reduce((eb, n, i) => (
				i > 0 && (i > 1 || typeof(n) != "number") && (eb.push(n)),
				eb
			), [1, typeof(e[1]) == "number" ? e[1] + 1 : 1]),
			(l => [
				typeof(l) == "number" ? [l, x.length - 1] : l,
				typeof(l) == "number" ? [1, x.length - 1] : l.map((x, i) =>
					i == 0 ? 1 : x
				)
			])(x.at(-1))
		),
	rec: (f, x, r, s) =>
		(([x, r]) =>
			(x =>
				s == undefined ? $big.trim(x) : x
			)(
				r == 0 ? x : $big.addE(
					x,
					f.grr.map((x, i) => i == 0 ? 1 : x),
					$big.cHyp(f.grr[0], 2, r)
				)
			)
		)(
			((f, x) => f(f, x))((fr, [x, r]) =>
				typeof(x) == "number" && (typeof(r) != "number" || r > 0) ?
					fr(fr, [
						f.fun(x, (s || 0) + (r == 1 ? 0 : $big.len(f.grr))),
						typeof(r) == "number" ? r - 1 : r
					]) :
				[x, r],
			[x, r])
		),
	exp: x =>
		$big.lt(x, [53, 1, 1]) ?
			typeof(x) == "number" ?
				x <= 53 ? 2**x : [x, 1] :
			[x[0], x[1] + 1] :
		x,
	/* x >= 0 */
	log: x =>
		$big.gte(x, [53, 1, 1]) ? x :
		typeof(x) == "number" ? Math.log2(x) :
		x[1] == 1 ? x[0] : [x[0], x[1] - 1],
	expR: () => ({
		grr: [1, 1],
		fun: (x, s) =>
			x <= 53 ? 2**x : s >= $big.prec - 1 ? [Infinity] : [x, 1]
	}),
	/*
		2**53 >= l >= 2
		2**53 >= h >= 1
		2**53 >= r >= 2
	*/
	hypS: (l, h, r, s) =>
		h == 1 ? (x =>
			x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(l, 3, $big.exp(r))
		)(l**r) :
		l == 2 && r == 2 ? 4 :
		s >= $big.prec - 1 && h >= 4 ? [Infinity] :
			$big.rec($big.hypR(l, h - 1), l, r - 1, s),
	/*
		l >= 2
		2**53 >= h >= 1
		2**53 >= r >= 2
	*/
	hypL: (h, r) => ({
		grr: [r - 1, h - 1],
		fun: (x, s) =>
			$big.hypS(x, h, r, s)
	}),
	/*
		2**53 >= l >= 2
		2**53 >= h >= 1
		r >= 2
	*/
	hypR: (l, h) => ({
		grr: [1, h],
		fun: (x, s) =>
			$big.hypS(l, h, x, s)
	}),
	/*
		2**53 >= l >= 2
		h >= 1
		2**53 >= r >= 2
		r, l != 2, 2
	*/
	hypH: (l, r) => ({
		grr: [1, [1, 2]],
		fun: (x, s) =>
			$big.hypS(l, x, r, s)
	}),
	/*
		2**53 >= l >= 0
		2**53 >= h >= -1
		2**53 >= r >= 0
	*/
	hyp: (l, h, r) =>
		h == -1 ? $big.cHyp(l, 1, r) :
		h == 0 ? $big.cHyp(l, 2, r) :
		l == 0 ? typeof(r) == "number" ? (r + 1) % 2 : 0 :
		l == 1 ? 1 :
		r == 0 ? 1 :
		r == 1 ? l :
		l == 2 && r == 2 ? 4 :
		typeof(h) != "number" ? $big.rec($big.hypH(l, r), h, 1) :
		typeof(r) != "number" ? $big.rec($big.hypR(l, h), r, 1) :
		typeof(l) != "number" ? $big.rec($big.hypL(h, r), l, 1) :
		$big.hypS(l, h, r),
	g: (x, s) =>
		/* thanks, graham */
		s >= $big.prec - 1 ? [Infinity] :
			$big.rec($big.hypH(3, 3), 4, x, s),
	gR: () => ({
		grr: [1, 1, [1, 2]],
		fun: (x, s) =>
			$big.g(x, s)
	}),
	/* o is limit ordinal, x < [53, 1] */
	fsq: (o, x) =>
		(o =>
			o.length == 1 && typeof(o[0]) == "number" ? o[0] : o
		)(
			((f, x) => f(f, x))((f, o) =>
				o.reduceRight((o, e, i) =>
					i == 0 ?
						typeof(e) == "number" ? (e > 1 && o.push(e - 1), o) : ((e2, e) => (
							e[0] > 0 && o.push(e),
							o.push(e2),
							o
						))(
							(e2 =>
								e2.length == 1 && e2[0] == 1 ? x : e2.reduce((e2, x) => (
									e2.push(x),
									e2
								), [typeof(e[1]) == "number" ? x : 1])
							)(f(f, e.filter((x, i) => i > 0))),
							e.map((x, i) => i == 0 ? x - 1 : x)
						) :
					(o.push(typeof(e) == "number" ? [e, i + 1] : e), o),
				[]).toReversed(),
			o)
		),
	fgh: (x, o, r, s) =>
		r == 0 ? x :
		o == 0 ? $big.cHyp(x, 1, r) :
		x == 0 ? 0 :
		x == 1 ? 2 :
		s >= $big.prec - 1 && (
			$big.gte(o, 4) && $big.lt(o, [0, 1]) ||
			$big.gte(o, [1, 1])
		) ? [Infinity] :
		o == 1 ? $big.cHyp($big.exp(r), 2, x) :
		o == 2 ?
			$big.lt(x, [53, 2]) ?
				(x =>
					r == 1 ? x : $big.fgh(x, o, $big.cHyp(r, 1, 1, true), s)
				)($big.cHyp($big.exp(x), 2, x)) :
			$big.rec($big.fghR(o), x, r, s) :
		$big.len(o) > $big.prec &&
			typeof(o) == "object" && typeof(o[0]) == "object" && ((f, x) => f(f, x))((f, x) =>
				x[0] > 1 || (typeof(x[1]) == "number" ? x[1] > 2 : f(f, x[1]))
			, o[0]) ?
			$big.rec($big.fghR(o), [53, 1], r, s) :
		$big.rec($big.fghR(o), x, r, s),
	fghR: o => ({
		grr: typeof(o) == "number" ? [1, o - 1] : o.reduce((o, x, i) => (
			o.push(x),
			o
		), [1]),
		fun: (x, s) =>
			typeof(o) == "number" ?
				$big.fgh(x, o - 1, x, s) :
			typeof(o[0]) == "number" ?
				$big.fgh(x, $big.fsq(o, x), x, s) :
			$big.fgh(x, $big.fsq(o, x), 1, s)
	})
}

$bigord = {
	list: (x, n) =>
		x.reduce((x, e, i) => (
			i > 0 && (
				typeof(e) == "number" ? (x[i - 1] = e) : (x[e[1] - 1] = e[0])
			),
			x
		), (a => (
			x[0] == Infinity && (a[x[1][1] - 2] = Infinity),
			a
		))(Array(n).fill(0))),
	/* [1, [1, 3]] > x */
	hyp: (x, f) =>
		(([a, b]) =>
			b == 0 ? [
				a == 1 ? "" : "ω" +
				(a == 2 ? "" : "<sup>" + (a - 1) + "</sup>"),
				""
			] : b == 1 ?
				f ?
					a == 0 ?
						["ω<sup>ω+", "</sup>"] :
						["(ω↑)<sup>" + (a + 1) + "</sup>(ω+", ")"] :
					[
						a == Infinity ? "ω<sup>...</sup>" :
						a == 0 ? "ω<sup>ω</sup>" :
						"<sup>" + (a + 2) + "</sup>ω",
						""
					] :
			b <= 4 ? [
				["ε", "ζ", "η"][b - 2] +
				(a == 0 || a == Infinity ? "" : "<sup>" + (a + 1) + "</sup>") + "(" +
				(f ? "" : a == Infinity ? "..." : "0"),
				")"
			] : [
				"φ" +
				(a == 0 || a == Infinity ? "" :
					"<sup>" + (a + 1) + "<sub>2</sub></sup>"
				) + "(" +
				(b - 1) + "," + (f ? "" : a == Infinity ? "..." : "0"),
				")"
			]
		)($bigord.list(x, 2)),
	/* [1, [2, 2], [1, 3]] > x >= [1, [1, 3]] */
	gam: (x, f) =>
		(([a, b, c]) =>
			b == 2 ? ["Γ<sup>" + (f ? "ω+" : "ω"), "</sup>(0)"] : [
				["φ", "Γ"][b] +
				(a == 0 || a == Infinity ? "" :
					"<sup>" + (a + 1) + (b == 1 ? "" : "<sub>2</sub>") + "</sup>"
				) + "(" +
				(b == 0 ? f ? "ω+" : "ω" : f ? "" : a == Infinity ? "..." : "0"),
				(b == 1 ? "" : ",0") + ")"
			]
		)($bigord.list(x, 3)),
	/* [1, 1, [1, 4]] > x */
	veb: (x, f) =>
		(([a, b, c, d]) =>
			d == 1 ? ["φ(ω<sub>" + (f ? "ω+" : "ω"), "</sub>)"] : [
				"φ" + (
					c == 0 && b == 0 ? "(0," + (a - 1) + ")" :
					(a == 0 || a == Infinity ? "" :
						"<sup>" + (a + 1) + "<sub>" + (c + 2) + "</sub></sup>"
					) + "(" +
					(b == 0 ? (f ? "" : "ω") :
						(b == Infinity ? "..." : b) +
						"<sub>" + (c + 3) + "</sub>" +
						(f ? "," : a == Infinity ? ",..." : "")
					)
				),
				(c == 0 && b == 0 ? "" :
					(f || b == 0 || a == Infinity ?
						"<sub>" + (c + 2) + "</sub>" : ""
					) + ")"
				)
			]
		)($bigord.list(x, 4)),
	/* [1, [1, 5]] > x >= [1, [2, 2]] */
	ocf: (x, f) =>
		(([a, b, c, d, e]) =>
			e == 1 ?
				["ψ(ε<sub>Ω+1", "</sub>)"] :
			d == 0 && c == 0 ?
				b == 2 ? [
					(a == 0 && !f ? "" : "(") + "ψ(" +
					(a == 0 && !f ? "0" : "x") + ")" +
					(a == 0 && !f ? "" : ")" +
						(a == 0 || a == Infinity ? "" :
							"<sup>" + (a + 1) + "</sup>"
						) + "(" +
						(f ? "" : a == Infinity ? "..." : "0")),
					(a == 0 && !f ? "" : ")")
				] : [
					(a == 0 && !f ? "" : "(") +
					("ψ(" +
						(b == 2 ? "" : "Ω" + (b == 3 ? "" : "<sup>" +
						(b == Infinity ? "..." : b - 2) +
						"</sup>")) +
						((a == 0 && !f ? "" : "x") + ")")) +
					(a == 0 && !f ? "" : ")" +
						(a == 0 || a == Infinity ? "" :
							"<sup>" + (a + 1) + "</sup>"
						) + "(" +
						(f ? "" : a == Infinity ? "..." : "1")),
					(a == 0 && !f ? "" : ")")
				] :
			[
				(a == 0 && !f ? "" : "(x->") + (
					"ψ(" +
					(d == 0 ? "Ω<sup>" : "(Ω↑)<sup>" + (d + 1) + "</sup>") + (
						(c =>
							(c == 0 ? "" : "Ω" + (c == 1 ? "" : "<sup>" + (
								c == Infinity ? "..." : c
							) + "</sup>"))
						)(c + (a == 0 && !f && b > 0 ? 1 : 0)) +
						(a == 0 && !f ? "" : "(") + (
							(c == Infinity ? "" :
								b == 0 ? "ω" :
								(a == 0 && !f ? "" : "Ω") +
								(b == Infinity ? "..." : b == 1 ? "" : b)
							) + (a == 0 && !f ? "" : "+x")
						) + (a == 0 && !f ? "" : ")")
					) + (d == 0 ? "</sup>" : "") + ")"
				) +
				(a == 0 && !f ? "" : ")" +
					(a == 0 || a == Infinity ? "" : "<sup>" + (a + 1) + "</sup>") + "(" +
					(f ? "" : a == Infinity ? "..." : "0")),
				(a == 0 && !f ? "" : ")")
			]
		)($bigord.list(x, 5)),
	ord: (x, f) =>
		(([l, r]) =>
			f ? [l, r] : l + r
		)(
			$big.lt(x, [1, 2]) ? ["", ""] :
			!f && $big.eq(x, [1, [2, 2]]) ? ["SCO", ""] :
			!f && $big.eq(x, [1, [3, 2]]) ? ["CO", ""] :
			!f && $big.eq(x, [1, [4, 2]]) ? ["LCO", ""] :
			$big.lt(x, [1, [1, 3]]) ? $bigord.hyp(x, f) :
			!f && $big.eq(x, [1, [1, 2], [1, 3]]) ? ["FSO", ""] :
			$big.gte(x, [1, [1, 3]]) &&
				$big.lt(x, [1, 1, [2, 2], [1, 3]]) ?
				$bigord.gam(x, f) :
			!f && $big.eq(x, [1, [1, 2], [2, 3]]) ? ["AO", ""] :
			!f && $big.eq(x, [1, [1, 4]]) ? ["SVO", ""] :
			$big.lt(x, [1, 1, [1, 4]]) ? $bigord.veb(x, f) :
			!f && $big.eq(x, [1, [1, 2], [1, 4]]) ? ["LVO", ""] :
			!f && $big.eq(x, [1, [1, 5]]) ? ["BHO", ""] :
			$big.gte(x, [1, [2, 2]]) &&
				(f ? $big.lt(x, [1, [1, 5]]) : $big.lt(x, [1, 1, [1, 5]])) ?
				$bigord.ocf(x, f) :
			["", ""]
		)
}

$bigstr = {
	dec: (x, int) =>
		x == Infinity ? "..." :
			(x < 0 ? "-" : "") + (x =>
				(x =>
					Math.floor(x) + (int ? "" : "." + ("000" +
						Math.floor(x * 1000)
					).slice(-3))
				)(x + (x >= 2**42 ||
					Number.EPSILON * 2**Math.floor(Math.log2(x))
				))
			)(Math.abs(x)),
	raw: x =>
		typeof(x) == "number" ? $bigstr.dec(x) :
		((f, x) => f(f, x, true))((f, [str, x], fst) =>
			x.reduceRight((str, xNext, i) =>
				(x.length == 1 ? "" :
					/* add/remove brackets to add/remove opening strings at beginning */
					((str == null ? "" : str) +
						/* array opening and closing strings */
						(i == x.length - 1 ? "<sup>" : i == 0 ? "</sup>" :
							/* strings between number and number or array respectively */
							(typeof(xNext) == "number" ? "," : ",")))) +
				(typeof(xNext) == "number" ?
					fst && i == 0 ? $bigstr.dec(xNext) :
					xNext == Infinity ? "..." : xNext.toString() :
					f(f, [str == null ? null : "", xNext])),
			str),
		[null, x]),
	mde: x =>
		typeof(x) == "number" ?
			(x =>
				(l => [
					x / 10**l,
					l
				])(Math.floor(Math.log10(x)))
			)(x + Number.EPSILON * 2**Math.floor(Math.log2(x))) :
		(l => [
			10**(l % 1),
			Math.floor(l),
		])($big.cHyp($big.log(x), 2, Math.log2(10), true)),
	/* 1e33 > x */
	illlim: 0,
	ill: (x, int) =>
		typeof(x) == "number" && x < 1000 ? $bigstr.dec(x, int) :
		(([m, e]) =>
			(([m, e]) =>
				$bigstr.dec(m) + (e == -1 ? "" :
					["K", "M", "B", "T", "q", "Q", "s", "S", "O", "N"][e]
				)
			)((r =>
				[m * 10**r, (e - r) / 3 - 1]
			)(e % 3))
		)($bigstr.mde(x)),
	/* e1e33 > x */
	mdelim: 0,
	elim: 0,
	e: (x, int) =>
		typeof(x) == "number" && x < 1000 ? $bigstr.dec(x, int) :
		$big.lt(x, $bigstr.mdelim) ?
			(([m, e]) =>
				$bigstr.dec(m) + "e" + e
			)($bigstr.mde(x)) :
		"e" + $bigstr.ill($big.cHyp($big.log(x), 2, Math.log2(10), true)),
	/* [53, 1, [1, [1, 2]]] > x */
	hyp: x =>
		x.reduceRight((str, r, i) =>
			str + (i == 0 ? $bigstr.dec(r) :
				(([r, h]) =>
					(r == 1 ? "" : "(") +
					"2↑" +
					(h == 1 ? "" : "<sup>" + h + "</sup>") +
					(r == 1 ? "" : ")<sup>" + r + "</sup>")
				)(typeof(r) == "number" ? [r, i] : r)),
		""),
	/* [53, 1, [1, 1, 1]] > x >= [53, 1, [1, [1, 2]]] */
	ack: x =>
		(r =>
			"Ack" +
			(r == 1 ? "" : "<sup>" + r + "</sup>") +
			"(" + $bigstr.str(x.toSpliced(-1)) + ")"
		)(x.at(-1)[0]),
	/* [53, 1, [1, 2, 1]] > x >= [53, 1, [1, 1, 1]] */
	g: x =>
		(r =>
			"G" +
			(r == 1 ? "" : "<sup>" + r + "</sup>") + "(" + (
				x[0] == Infinity && x.length == 2 ? "..." :
				$bigstr.str(x.toSpliced(-1))
			) + ")"
		)(x.at(-1)[0]),
	/* [53, 1, [2, 2, 1]] > x >= [53, 1, [1, 2, 1]] */
	eg: x =>
		"G<sup>" + (
			x[0] == Infinity && x.length == 2 ? "..." :
			$bigstr.str(x.toSpliced(-1))
		) + "</sup>(64)",
	/* [53, 1, 1, [1, [1, 4]]] > x */
	sgh: x =>
		typeof(x) == "number" ? $bigstr.dec(x) :
		(x.length == 2 && x[0] != Infinity ? "" : "g<sub>" + (
			x.reduce((str, o, i) =>
				i < (x[0] == Infinity ? 1 : 2) ? str :
				(i == (x[0] == Infinity ? 1 : 2) ? x => x : ([l, r]) =>
					l + str + r
				)($bigord.ord((o =>
					o.reduce((o, e, i) =>
						((i == 0 && e == 1 || e == Infinity) || o.push((i == 0 ?
							e - 1 :
							typeof(e) == "number" ? [e, i + 1] :
							(e.length == 2 && typeof(e[1]) == "number" ?
								[e[0], e[1] + 1] :
								e
							)
						)), o),
					[o[0] == Infinity ? Infinity : 1])
				)(typeof(o) == "number" ? [o, i] : o), i > (x[0] == Infinity ? 1 : 2))),
			"")
		) + "</sub>(") + (
			x[0] == Infinity ? "..." :
				(x[1] == 1 ? "2<sup>" : "(2↑)<sup>" + x[1] + "</sup>") +
				$bigstr.dec(x[0]) +
				(x[1] == 1 ? "</sup>" : "")
		) +
		(x.length == 2 && x[0] != Infinity ? "" : ")"),
	fgh: x =>
		typeof(x) == "number" ? $bigstr.dec(x) :
		x.reduceRight((str, o, i) =>
			str + (
				i == 0 ?
					o == Infinity ? "..." : $bigstr.dec(o) :
				i == 1 && x[0] != Infinity ?
					(o == 1 ? "" : "(") + "2↑" +
					(o == 1 ? "" : ")<sup>" + o + "</sup>") :
				(o =>
					"<i>f</i><sub>" + (
						((f, x) => f(f, x))((f, [o, s]) =>
							o.reduceRight((str, o, i) =>
								i == 0 ? (o == Infinity ? str + " + ..." : str) :
								(o =>
									(str == null ? "" : str + " + ") +
									(o.length == 2 && o[1] == 1 ? "" : "ω" +
										(o.length == 2 && o[1] == 2 ? "" : "<sup>" + (
											o.length == 2 && typeof(o[1]) == "number" ? o[1] - 1 : f(f, [o])
										) + "</sup>")
									) +
									(o[0] == Infinity ? "" : o[0] == 1 && (o.length > 2 || o[1] != 1) ? "" :
										(o[0] + (s ? 2 : 0))
									)
								)(typeof(o) == "number" ? [o, i] : o)
							, null)
						, [o, o.length == 2 && typeof(o[1]) == "number"])
					) + "</sub>" + (
						o[0] == 1 || o[0] == Infinity ? "" : "<sup>" + o[0] + "</sup>"
					) + "("
				)(typeof(o) == "number" ? [o, i] : o)
			),
		"") + ")".repeat(x.length - (x[0] == Infinity ? 1 : 2)),
	str: (x, int) =>
		$big.lt(x, $bigstr.illlim) ? $bigstr.ill(x, int) :
		$big.lt(x, $bigstr.elim) ? $bigstr.e(x, int) :
		$big.lt(x, [53, 1, [1, [1, 2]]]) ? $bigstr.hyp(x) :
		$big.lt(x, [53, 1, [1, 1, 1]]) ? $bigstr.ack(x) :
		$big.lt(x, [53, 1, [1, 2, 1]]) ? $bigstr.g(x) :
		$big.lt(x, [53, 1, [2, 2, 1]]) ? $bigstr.eg(x) :
		$big.lt(x, [53, 1, 1, [1, [1, 4]]]) ? $bigstr.sgh(x) :
		$bigstr.fgh(x)
}

class Big {
	constructor(x) {
		this.val = x instanceof Big ? x.val : $big.con(x);
	}
	str(int) {
		return $bigstr.str(this.val, int);
	}
	cmp(b) {
		b = new Big(b);
		return new Big($big.cmp(this.val, b.val));
	}
	gsp(b) {
		b = new Big(b);
		return (([a, b]) =>
			[new Big(a), new Big(b)]
		)($big.gsp(this.val, b.val))
	}
	gte(b) {
		b = new Big(b);
		return $big.gte(this.val, b.val);
	}
	gt(b) {
		b = new Big(b);
		return $big.gt(this.val, b.val);
	}
	lte(b) {
		b = new Big(b);
		return $big.lte(this.val, b.val);
	}
	lt(b) {
		b = new Big(b);
		return $big.lt(this.val, b.val);
	}
	eq(b) {
		b = new Big(b);
		return $big.eq(this.val, b.val);
	}
	neq(b) {
		b = new Big(b);
		return $big.neq(this.val, b.val);
	}
	max(b) {
		b = new Big(b);
		return new Big($big.max(this.val, b.val));
	}
	min(b) {
		b = new Big(b);
		return new Big($big.min(this.val, b.val));
	}
	flr() {
		return new Big(
			typeof(this.val) == "number" ? Math.floor(this.val) : this.val
		);
	}
	rou() {
		return new Big(
			typeof(this.val) == "number" ? Math.round(this.val) : this.val
		);
	}
	cei() {
		return new Big(
			typeof(this.val) == "number" ? Math.ceil(this.val) : this.val
		);
	}
	neg() {
		return new Big($big.neg(this.val));
	}
	abs() {
		return new Big($big.abs(this.val));
	}
	inv() {
		return new Big($big.inv(this.val));
	}
	suc() {
		return new Big((a =>
			typeof(a) == "number" ? a + 1 : a
		)(this.val));
	}
	pre() {
		return new Big((a =>
			typeof(a) == "number" ? a - 1 : a
		)(this.val));
	}
	smp(b) {
		b = new Big(b);
		return new Big(((a, b) =>
			typeof(a) == "number" && typeof(b) == "number" ?
				((a, b) =>
					a + Math.log1p(2**(b - a)) / Math.log(2)
				)($big.gsp(a, b)) :
			$big.max(a, b)
		)(this.val, b.val));
	}
	smn(b) {
		b = new Big(b);
		if ($big.lt(a, b)) {
			return NaN;
		}
		return new Big(((a, b) =>
			typeof(a) == "number" ? a + Math.log1p(-(2**(b - a))) / Math.log(2) : a
		)(this.val, b.val));
	}
	add(b) {
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 1, b)
			)(typeof(a) == "number" && typeof(b) == "number" ? a + b : Infinity)
		)(this.val, b.val));
	}
	sub(b) {
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 1, b, true)
			)(typeof(a) == "number" && typeof(b) == "number" ? a - b : Infinity)
		)(this.val, b.val));
	}
	mul(b) {
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 2, b)
			)(typeof(a) == "number" && typeof(b) == "number" ? a * b : Infinity)
		)(this.val, b.val));
	}
	div(b) {
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 2, b, true)
			)(typeof(a) == "number" && typeof(b) == "number" ? a / b : Infinity)
		)(this.val, b.val));
	}
	pow(b) {
		if ($big.lt(this.val, 0)) {
			return NaN;
		}
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 3, $big.exp(b))
			)(typeof(a) == "number" && typeof(b) == "number" ? a ** b : Infinity)
		)(this.val, b.val));
	}
	root(b) {
		if ($big.lt(this.val, 0)) {
			return NaN;
		}
		b = new Big(b);
		return new Big(((a, b) =>
			(x =>
				x != Infinity ? x <= 2**53 ? x : [Math.log2(x), 1] :
				$big.cHyp(a, 3, $big.exp(b), true)
			)(typeof(a) == "number" && typeof(b) == "number" ?
				a ** (1 / b) : Infinity)
		)(this.val, b.val));
	}
	/* raises the magnitude to a power, like dilation in antimatter dimensions */
	/* c^(log_c(a)^b) */
	mpow(b, c) {
		if ($big.lt(this.val, 1)) {
			return NaN;
		}
		b = new Big(b);
		if (c == undefined) {
			return new Big($big.cHyp(this.val, 4, $big.exp($big.exp(b.val))));
		}
		c = new Big(c);
		if ($big.lt(c.val, 0)) {
			return NaN;
		}
		return new Big($big.cHyp(
			$big.cHyp(this.val, 3, c),
			4,
			$big.cHyp($big.exp($big.exp(b.val)), 3, c)
		));
	}
	/* does a root on the magnitude */
	/* c^(root_b(log_c(a))) */
	mroot(b, c) {
		if ($big.lt(this.val, 1)) {
			return NaN;
		}
		b = new Big(b);
		if (c == undefined) {
			return new Big($big.cHyp(this.val, 4, $big.exp($big.exp(b.val)), true));
		}
		c = new Big(c);
		if ($big.lt(c.val, 0)) {
			return NaN;
		}
		return new Big($big.cHyp(
			$big.cHyp(this.val, 3, c),
			4,
			$big.cHyp($big.exp($big.exp(b.val)), 3, c),
			true
		));
	}
	exp(b) {
		if (b == undefined) {
			return new Big($big.exp(this.val));
		}
		b = new Big(b);
		if ($big.lt(b.val, 0)) {
			return NaN;
		}
		return new Big(
			$big.exp($big.cHyp(this.val, 2, $big.log(b.val)))
		);
	}
	log(b) {
		if ($big.lt(this.val, 0)) {
			return NaN;
		}
		if (b == undefined) {
			return new Big($big.log(this.val));
		}
		b = new Big(b);
		if ($big.lt(b.val, 0)) {
			return NaN;
		}
		return new Big($big.cHyp($big.log(this.val), 2, $big.log(b.val), true));
	}
	tet(b) {
		if ($big.lt(this.val, 0) || !$big.int(this.val)) {
			return NaN;
		}
		b = new Big(b);
		if ($big.lt(b.val, 0) || !$big.int(b.val)) {
			return NaN;
		}
		return new Big($big.hyp(this.val, 2, b.val));
	}
	pent(b) {
		if ($big.lt(this.val, 0) || !$big.int(this.val)) {
			return NaN;
		}
		b = new Big(b);
		if ($big.lt(b.val, 0) || !$big.int(b.val)) {
			return NaN;
		}
		return new Big($big.hyp(this.val, 3, b.val));
	}
	hex(b) {
		if ($big.lt(this.val, 0) || !$big.int(this.val)) {
			return NaN;
		}
		b = new Big(b);
		if ($big.lt(b.val, 0) || !$big.int(b.val)) {
			return NaN;
		}
		return new Big($big.hyp(this.val, 4, b.val));
	}
	hyp(b, c) {
		if ($big.lt(this.val, 0) || !$big.int(this.val)) {
			return NaN;
		}
		b = new Big(b);
		if ($big.lt(b.val, 1) || !$big.int(b.val)) {
			return NaN;
		}
		c = new Big(c);
		if ($big.lt(b.val, 0) || !$big.int(b.val)) {
			return NaN;
		}
		return new Big($big.hyp(this.val, b.val, c.val));
	}
	ack() {
		if ($big.lt(this.val, 1) || !$big.int(this.val)) {
			return NaN;
		}
		return new Big(
			$big.hyp(this.val, $big.cHyp(this.val, 1, 2, true), this.val)
		);
	}
	g() {
		if ($big.lt(this.val, 1) || !$big.int(this.val)) {
			return NaN;
		}
		return new Big($big.g(this.val));
	}
	grc(b) {
		if ($big.lt(this.val, 1) || !$big.int(this.val)) {
			return NaN;
		}
		b = new Big(b);
		if ($big.lt(b.val, 0) || !$big.int(b.val)) {
			return NaN;
		}
		return new Big($big.rec($big.gR(), this.val, b.val));
	}
	fgh(o, r) {
		if ($big.lt(this.val, 0) || !$big.int(this.val)) {
			return NaN;
		}
		r = new Big(r);
		return new Big($big.fgh(this.val, o, r.val));
	}
	fun(b, c) {
		return new Big($big.rec(b, this.val, c));
	}
}

Big.new = (a) => new Big(a);
Big.str = (a, b) => new Big(a).str(b);
Big.cmp = (a, b) => new Big(a).cmp(b);
Big.gsp = (a, b) => new Big(a).gsp(b);
Big.gte = (a, b) => new Big(a).gte(b);
Big.gt = (a, b) => new Big(a).gt(b);
Big.lte = (a, b) => new Big(a).lte(b);
Big.lt = (a, b) => new Big(a).lt(b);
Big.eq = (a, b) => new Big(a).eq(b);
Big.neq = (a, b) => new Big(a).neq(b);
Big.max = (a, b) => new Big(a).max(b);
Big.min = (a, b) => new Big(a).min(b);
Big.neg = (a) => new Big(a).neg();
Big.abs = (a) => new Big(a).abs();
Big.inv = (a) => new Big(a).inv();
Big.suc = (a) => new Big(a).suc();
Big.pre = (a) => new Big(a).pre();
Big.smp = (a, b) => new Big(a).smp(b);
Big.smn = (a, b) => new Big(a).smn(b);
Big.add = (a, b) => new Big(a).add(b);
Big.sub = (a, b) => new Big(a).sub(b);
Big.mul = (a, b) => new Big(a).mul(b);
Big.div = (a, b) => new Big(a).div(b);
Big.pow = (a, b) => new Big(a).pow(b);
Big.root = (a, b) => new Big(a).root(b);
Big.mpow = (a, b, c) => new Big(a).mpow(b, c);
Big.mroot = (a, b, c) => new Big(a).mroot(b, c);
Big.exp = (a, b) => new Big(a).exp(b);
Big.log = (a, b) => new Big(a).log(b);
Big.tet = (a, b) => new Big(a).tet(b);
Big.pent = (a, b) => new Big(a).pent(b);
Big.hex = (a, b) => new Big(a).hex(b);
Big.hyp = (a, b, c) => new Big(a).hyp(b, c);
Big.ack = (a) => new Big(a).ack();
Big.g = (a) => new Big(a).g();
Big.grc = (a, b) => new Big(a).grc(b);
Big.fgh = (a, b, c) => new Big(a).fgh(b, c);
Big.fun = (a, b, c) => new Big(a).fun(b, c);

$bigstr.illlim = Big.pow(10, 33).val;
$bigstr.mdelim = Big.pow(10, 1000).val;
$bigstr.elim = Big.pow(10, Big.pow(10, 33)).val;
