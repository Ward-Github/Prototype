import requests
from bs4 import BeautifulSoup
import json

def get_data():
    url = 'https://ev-database.org/#sort:path~type~order=.rank~number~desc|rs-price:prev~next=10000~100000|rs-range:prev~next=0~1000|rs-fastcharge:prev~next=0~1500|rs-acceleration:prev~next=2~23|rs-topspeed:prev~next=110~350|rs-battery:prev~next=10~200|rs-towweight:prev~next=0~2500|rs-eff:prev~next=100~300|rs-safety:prev~next=-1~5|paging:currentPage=0|paging:number=all'
    response = requests.get(url)

    soup = BeautifulSoup(response.text, 'html.parser')

    car_list = []
    cars = []
    duplicates = 0
    key = 1

    for car_div in soup.find_all('div', class_='list-item'):
        car_name = car_div.find('h2').text.strip()
        useable_battery = car_div.find('span', class_='battery').text.strip() + " kWh"
        range_ = car_div.find('span', class_='erange_real').text.strip()
        efficiency = car_div.find('span', class_='efficiency').text.strip()

        car_data = {
            car_name: {
                'Useable battery': useable_battery,
                'Range': range_,
                'Efficiency': efficiency
            }
        }

        car = {
            'key': key,
            'value': car_name
        }

        if car_name not in car_list:
            car_list.append(car_data)
        else:
            duplicates += 1
        
        cars.append(car)

        key += 1

    with open('cars.json', 'w') as f:
        json.dump(car_list, f, indent=4)
    
    with open ('car_list.json', 'w') as f:
        json.dump(cars, f, indent=4)

    print(f"Removed {duplicates} duplicates.")

get_data()