#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <math.h>

using namespace std;

int main()
{
    int speed;
    cin >> speed; cin.ignore();
    int lightCount;
    cin >> lightCount; cin.ignore();
  
    float result = speed;
    vector<float> dist;
    vector<float> dur;
    for (int i = 0; i < lightCount; i++) {
        int distance;
        int duration;
        cin >> distance >> duration; cin.ignore();
        dist.push_back(distance);
        dur.push_back(duration);
    }

    for (int i = 0; i < lightCount; i++) {
        float val = (dist[i] * 3.6) / (result * dur[i]);
        int mult = (int)floor(val);
        
        if ( mult % 2 == 0) {   // this light is green
            cerr << "good" << endl;
        } else {    // light is red, compute new value
            result = floor(dist[i] * 3.6 / ( (mult+1) * dur[i]));
            cerr << "bad "<<result << endl;
            i = -1; // and retry all
        }
    }

    cout << result << endl;
}
