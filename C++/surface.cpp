#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

using namespace std;

void propagate(const int name,
            const int L,
            const int H,
            const int X,
            const int Y,
            vector<vector<int> >& surface,
            const bool leftOnly = false,
            const bool init = false) {

    if ( init ||
        ( surface[X][Y] != 0 && surface[X][Y] != name )) 
    {
        surface[X][Y] = name;
        if ( !leftOnly ) {
            if ( X > 0 ) propagate(name, L, H, X-1, Y, surface);
            if ( Y > 0 ) propagate(name, L, H, X, Y-1, surface);
        }
        if (!init) {
            if ( X < H-1 ) propagate(name, L, H, X+1, Y, surface);
            if ( Y < L-1 ) propagate(name, L, H, X, Y+1, surface);
        }
    }
}

void computeSize(const int L,
            const int H,
            vector<string>& inputMap,
            vector<vector<int> >& surface,
            map<int,int>& lake) {
    
    int lastLake = 0;            
    for (int i = 0; i < H; i++) {
        for (int j = 0; j < L; j++) {
            
            if (inputMap[i][j] == 'O') {
                int sum = 1;
                int name = 0;
                
                if ( i > 0 && surface[i-1][j] != 0 ) { // not land
                    name = surface[i-1][j];
                    sum += lake[name];
                    if ( j > 0 && surface[i][j-1] != 0 && surface[i][j-1] != name) {
                        sum += lake[surface[i][j-1]];
                        lake.erase(surface[i][j-1]);
                    }
                    
                } else if ( j > 0 && surface[i][j-1] != 0 ) {
                    name = surface[i][j-1];
                    sum += lake[name];
                    
                } else { // new lake
                    name = ++lastLake;
                    lake.insert( std::pair<int,int>(name,1));
                }
                
                lake[name] = sum;
                propagate(name, L, H, i, j, surface, false, true);
            }
        }
    }
}

void display(const int L,
            const int H,
            vector<string>& inputMap,
            vector<vector<int> >& surface,
            map<int,int>& lake) {
                
    int minL=65;
    int maxL=80;
    int minH=34;
    int maxH=55;
    cerr << "lake" << endl;
    for (map<int,int>::iterator it=lake.begin(); it!=lake.end(); ++it)
        cerr << it->first << " => " << it->second << endl;

    for (int i = 0; i < H; i++) {
        for (int j = 0; j < L; j++) {
            if (i > minH && i < maxH && j > minL && j < maxL) 
            cerr << inputMap[i][j];
        }
        cerr << endl;
    }

    for (int i = 0; i < H; i++) {
        for (int j = 0; j < L; j++) {
            if (i > minH && i < maxH && j > minL && j < maxL) 
            cerr << surface[i][j] << " | ";
        }
        cerr << endl;
    }
}


int main()
{
    int L;
    cin >> L; cin.ignore();
    int H;
    cin >> H; cin.ignore();
    
    vector<string> inputMap;
    map<int,int> lake;
    lake.insert( std::pair<int,int>(0,0) ); // lake 0: is land
    vector<int> emptyLine(L, 0);
    vector<vector<int>> surface(H, emptyLine); // init with land

        
    for (int i = 0; i < H; i++) {
        string row;
        getline(cin, row);
        inputMap.push_back(row);
    }
    computeSize(L, H, inputMap, surface, lake);
//    display(L, H, inputMap, surface, lake);
    
    int N;
    cin >> N; cin.ignore();
    
    for (int i = 0; i < N; i++) {
        int X;
        int Y;
        cin >> X >> Y; cin.ignore();

        int result = lake[ surface[Y][X] ];
        cout << result << endl;
    }
}
