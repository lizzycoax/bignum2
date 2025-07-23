bignum 2!!!
the limit is roughly f_ε_0(precision) in fast growing function hierarchy

string conversion notations:
decimals have 3 digits of precision
until 10^3: number (2, 10 etc) with no decimals if specified to be integer
until 10^33: standard notation (1.000K, 1.000M etc)
until 10^10^3: scientific notation (1.000e33, 1.000e300 etc)
until 10^10^33: exponentiated standard notation (e1.000K, e1.000M etc)
until Ack(2^53): knuths up arrow notation ((2↑)²1000, 2↑²2↑1000 etc)
until G(2^53): ackermann notation (Ack(9.007q), Ack^1000(9.007q) etc)
until G^(2^53)(64): graham notation (G(9.007q), G^1000(9.007q) etc)
until G^(G^(2^53)(64))(64): exponentiated graham notation (G^(9.007q)(64), G^(G(9.007q))(64) etc)
after that: slow growing function hierarchy up to BHO
after that: fast growing functino hierarchy

function list (numbers automatically convert to bignums):
Big.new(a): converts to bignum
Big.str(a, b): converts to string, as integer if b is true
Big.cmp(a, b): 1 if a > b, 0 if a == b and -1 if a < b
Big.gsp(a, b): array with first bignum greater than second bignum
Big.gte(a, b): a >= b
Big.gt(a, b):  a > b
Big.lte(a, b): a <= b
Big.lt(a, b):  a < b
Big.eq(a, b):  a == b
Big.neq(a, b): a != b
Big.max(a, b): max of a and b
Big.min(a, b): min of a and b
Big.neg(a): negative of a
Big.abs(a): absolute value of a
Big.inv(a): inverse of a
Big.suc(a): a + 1
Big.pre(a): a - 1
Big.smp(a, b): log(exp(a) + exp(b))
Big.smn(a, b): log(exp(a) - exp(b)); a < b gives NaN
Big.add(a, b): a + b
Big.sub(a, b): a - b
Big.mul(a, b): a * b
Big.div(a, b): a / b
Big.pow(a, b): a ^ b
Big.root(a, b): a ^ (1/b); b is 2 if undefined
Big.mpow(a, b, c): exp_c(log_c(a) ^ b); c is 2 if undefined
Big.mroot(a, b, c): exp_c(log_c(a) ^ (1/b)); c is 2 if undefined
Big.exp(a, b): exp_b(a); b is 2 if undefined
Big.log(a, b): log_b(a); b is 2 if undefined
Big.tet(a, b): a ^^ b; a and b must be non negative integers
Big.pent(a, b): a ^^^ b; a and b must be non negative integers
Big.hex(a, b): a ^^^^ b; a and b must be non negative integers
Big.hyp(a, b, c): a [b] c; a and c must be non negative integers, b must be a nonzero integer
Big.ack(a): a [a - 2] a; a must be a nonzero integer
Big.g(a): G(a) (grahams function); a must be a nonzero integer
Big.grc(a, b): G^b(a) (grahams function); a must be a nonzero integer, b must be a non negative integer
Big.fgh(a, b, c): f_b^c(a) (fast growing function hierarchy); a must be a non negative integer and b must be an ordinal under ε_0 (see below for how to input ordinals)

how to input an ordinal:
for finite ordinals you input a number
for transfinite ordinals you input a nested array
each value represents ω to the power of the index and multiplied by the value
so [1, 2, 3, 4] represents ω^3 * 4 + ω^2 * 3 + ω2 + 1
for arrays in arrays, the first value is the value while the rest are the index (with an offset of 1 if the index is finite)
so [1, 2, [3, 3], [4, 4]] is the same as [1, 2, 3, 4]
if there are multiple values in the index, that represents another ordinal
so the nested array in [[10, 1, 2, 3]] represents 10 at the index [1, 2, 3] so the array represents ω^(ω^2 + ω + 1) * 10
arrays must be in a form where there are no zeroes, so [1, 2, 0, 3] has to be [1, 2, [3, 4]]
