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
after that: visual representation of internal value

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
Big.hyp(a, b, c): a [b] c; a, b and c must be non negative integers, b must be nonzero
Big.ack(a): a [a - 2] a; a must be a nonzero integer
Big.g(a): G(a) (grahams function); a must be a nonzero integer
technical and unstable functions:
Big.fgh(a, b, c): f_b^c(a) (fast growing function hierarchy); a must be a non negative integer
Big.fun(a, b, c)
