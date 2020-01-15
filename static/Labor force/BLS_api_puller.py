# Imports library needed
import requests
import json
import pandas as pd
from bs4 import BeautifulSoup as bs

# Gets the pages with the states. The states end in 57 because there are some empty numbers in between
state_number = list(range(1,57))
# Series_ID = ["LASST060000000000006"]
Series_ID = [];
for i in state_number:
    if i < 10:
        Series_ID.append("LASST0"+str(i)+"0000000000006")
    else:    
        Series_ID.append("LASST"+str(i)+"0000000000006")
    # last number indicates different data types, 3,4,5,6,7 is available

# Name of the file to be saved as
SaveFileAs = "Labor Force Data.csv"


#Get your jsonified api data here

#Collecting only 2017 Data
startyear = 2017
endyear = 2017
#Base URL for BLS web scraping
base_URL = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
# Set parameters as described by BLS website
headers = {'Content-type': 'application/json'}

State = []
Labor_Force = []

for this_data in Series_ID:
    #Collect data for this series ID
    data = json.dumps({"seriesid": [this_data],"startyear":startyear, "endyear":endyear,"registrationkey":"a1996666110d420cbf38f706289109f6"})
    # Request for api data
    Complete_Data = requests.post(f"{base_URL}",data=data, headers=headers)
    # jsonify the data
    Complete_Data = Complete_Data.json()
    
    try:
        this_Labor_Force= Complete_Data["Results"]["series"][0]["data"][0]["value"]
        Labor_Force.append(this_Labor_Force)
        
        # Beautiful Soup to get state of data
        website = "https://beta.bls.gov/dataViewer/view/timeseries/"
        url = website+this_data;
        # Get response from website
        response = requests.get(url)
        # Create a session for scraping
        soup = bs(response.text, "html.parser")

        # Scrape data. Had to find a specific part that had the state name in each page.
        table_text = soup.find_all("table",{"id": "catalogDataTable1"})
        this_state = table_text[0].find("tr").find_all("td")[2].text
        this_state = this_state.replace("Labor Force: ","").replace(" (S)","")
        State.append(this_state)
        
    except(IndexError):
        print(IndexError)

# Create a pandas dataframe for the data collected
Labor_Force_db = pd.DataFrame({
    "State":State,
    "Labor Force":Labor_Force
    });

# Save as CSV so everyone can interact with Data
Labor_Force_db.to_csv(f"../data/{SaveFileAs}",index=False)