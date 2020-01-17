import sys
import math

L = int(input())
H = int(input())
inputMap = {}
lake = {}

def propagate(x, y, lake_name):
    for a, b in [(-1, 0), (0, -1), (1, 0), (0, 1)]:
        if x+a<0 or x+a>H-1 or y+b<0 or y+b>L-1 or x+a not in inputMap or y+b not in inputMap[x+a] or not inputMap[x+a][y+b]:
            continue
        if inputMap[x+a][y+b] != lake_name:
            lake[lake_name] += lake[inputMap[x+a][y+b]]
            lake[inputMap[x+a][y+b]] = 0
            inputMap[x+a][y+b] = lake_name
            propagate(x+a, y+b, lake_name)

for x in range(H):
    row = input()
    inputMap[x] = {}
    curr_lake = None
    for y in range(L):
        if row[y] != 'O':
            curr_lake = None
            inputMap[x][y] = None
            continue
        if not curr_lake:
            if x>0 and inputMap[x-1][y]:
                curr_lake = inputMap[x-1][y]
                lake[curr_lake] += 1
            else:
                curr_lake = "lake_"+str(len(lake.keys()))
                lake[curr_lake] = 1
        else:
            lake[curr_lake] += 1
        inputMap[x][y] = curr_lake
        propagate(x, y, curr_lake)

N = int(input())
for i in range(N):
    x, y = [int(j) for j in input().split()]
    print(0 if not inputMap[y][x] else lake[inputMap[y][x]])

