length = 20
mid = length // 2	

for i in range(length,-1, -2):
  diff = length - i + 1
  print(" "*mid, '*'*diff, ' '*mid)
  mid -= 1
