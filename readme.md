bignum 2!!!
the limit is roughly f_ε_0(precision) in fast growing function hierarchy

function list (numbers automatically convert to bignums):
Big.new(a): converts to bignum
Big.str(a): converts to string
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
Big.hyp(a, b, c): a \[b] c; a, b and c must be non negative integers, b must be nonzero
Big.ack(a): a \[a - 2] a; a must be a nonzero integer
Big.g(a): G(a) (grahams function); a must be a nonzero integer
technical and unstable functions:
Big.fgh(a, b, c): f_b^c(a) (fast growing function hierarchy); a must be a non negative integer
Big.fun(a, b, c)
