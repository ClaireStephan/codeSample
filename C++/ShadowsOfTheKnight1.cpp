#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <math.h>

using namespace std;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

int new_loc( int loc, int max, float eps ){
    // cerr << loc << "-" << max << "-" << (max - loc + eps) << endl;
    int result = round(loc + (max - loc + eps) / 2);
    if (result == loc) {
        return max;
    }
    // cerr << result << endl;
    return result;
    }

int main()
{
    int W; // width of the building.
    int H; // height of the building.
    cin >> W >> H; cin.ignore();
    int N; // maximum number of turns before game over.
    cin >> N; cin.ignore();
    int X0;
    int Y0;
    cin >> X0 >> Y0; cin.ignore();

    int X = X0;
    int Y = Y0;
    int Xmax = W;
    int Xmin = 0;
    int Ymax = H;
    int Ymin = 0;
    // game loop
    while (1) {
        string bombDir; // the direction of the bombs from batman's current location (U, UR, R, DR, D, DL, L or UL)
        cin >> bombDir; cin.ignore();

        char *cstr = &bombDir[0];
        for (int i=0; i<2; i++) {
          char letter = cstr[i];
          switch (letter) {
            case 'U':
                Ymax = Y;
                Y = new_loc(Y, Ymin, -0.1);
                break;
            case 'D':
                Ymin = Y;
                Y = new_loc(Y, Ymax, 0.1);
                break;
            case 'L':
                Xmax = X;
                X = new_loc(X, Xmin, -0.1);
                break;
            case 'R':
                Xmin = X;
                X = new_loc(X, Xmax, 0.1);
                break;
            default:
                break;
          }
        }

        // the location of the next window Batman should jump to.
        cout << X << " " << Y << endl;
    }
}
