#Learn more about primes at: https://jamesabela.github.io/jsfun/examples/primes.html
import datetime
def generate_n_primes(N):
    primes  = [2]
    chkthis = 3
    while len(primes) < N:
        ptest = False
        for i in primes:
            if chkthis%i == 0:
                ptest = True
                break
        primes  += [] if ptest else [chkthis]
        chkthis += 2
    return primes

# Tests time on your PC
a = datetime.datetime.now()
print(generate_n_primes(1000))
b = datetime.datetime.now()
c = b-a
seconds = c.total_seconds()

print("it took",seconds)