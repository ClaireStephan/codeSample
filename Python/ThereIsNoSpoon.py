import sys
import math

# Don't let the machines win. You are humanity's last hope...

width = int(input())  # the number of cells on the X axis
height = int(input())  # the number of cells on the Y axis
cell = [input() for _ in range(height)]

for i in range(height):
    for j in range(width):
        if cell[i][j] == '0':
            #init default neighbours
            rx,ry,dx,dy = (-1,-1,-1,-1)
            #check right
            x=j+1
            while x < width:
                if cell[i][x] == '0':
                    rx,ry = x,i
                    break
                x+=1
            #check down
            y=i+1
            while y < height:
                if cell[y][j] == '0':
                    dx,dy = j,y
                    break
                y+=1
            # Three coordinates: a node, its right neighbor, its bottom neighbor
            print(j,i,rx,ry,dx,dy)
            

