#读取大文件中某个字的次数
def count_str(f, target):
  buf = ""
  count_target = 0
  while True:
    while target in buf:
      pos = buf.index(target)
      count_target += 1
      yield buf[:pos + len(target)]
      buf = buf[pos + len(target):]
    chunk = f.read(1024)

    if not chunk:
      yield buf
      break
    buf += chunk
  print({target: count_target})


with open("input.txt") as f:
    for line in count_str(f, "new"):
        print(line)


