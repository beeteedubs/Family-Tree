from collections import Counter

c = Counter(a=2, b=2)
d = Counter(a=3, b=3)
print(not (c - d))
