const apiKey = '4a902cbaa0fdd191192a41c005f6512b';
const weatherAPIBaseURL = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&zip=';

// Function to create a new date instance dynamically with JS
const generateCurrentDate=()=>{
    const currentDate = new Date();
    return `${currentDate.getMonth() + 1}.${currentDate.getDate()}.${currentDate.getFullYear()}`;
};

// Event listener for the 'Generate' button
document.getElementById('generate').addEventListener('click', handleBtnClick);

// Function to handle the click event of the button with generate id
function handleBtnClick(event){
    console.log('Generate button clicked');
    const zipCode=document.getElementById('zip').value;
    const userFeelings=document.getElementById('feelings').value;
    const currentDate =generateCurrentDate();
    console.log(`Zip Code: ${zipCode}, Feelings: ${userFeelings}, Date: ${currentDate}`);
    fetchWeatherInfo(weatherAPIBaseURL, zipCode, apiKey)
        .then(weatherData=>{
            if (weatherData){
                console.log('Weather Data:',weatherData);
                return postUserEntry('/add',{
                    temperature: weatherData.main.temp,
                    date: currentDate,
                    userResponse: userFeelings
                });
            } else {
                throw new Error('Weather data not found');
            }
        })
        .then(data =>{
            console.log('Data posted successfully:', data);
            updateUserInterface();
        })
        .catch(error=>{
            console.error("Error occurred: ",error);
        });
}

// Async function to fetch weather data from the API
const fetchWeatherInfo = async(baseURL, zip, apiKey) => {
    const requestURL = `${baseURL}${zip},us&appid=${apiKey}`;
    console.log(`Fetching weather data from: ${requestURL}`);
    try{
        const response = await fetch(requestURL);
        const data = await response.json();
        if(response.ok){
            console.log('Weather data fetched successfully:', data);
            return data;
        }else{
            throw new Error(`Failed to fetch data: ${data.message}`);
        }
    }catch(error){
        console.error("Error fetching weather data: ", error);
    }
};

// Async function to post user entry to the server
const postUserEntry=async(url = '', data= {})=> {
    console.log(`Posting data to ${url}:`, data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try{
        const newData = await response.json();
        console.log('Data received from server:', newData);
        return newData;
    }catch(error){
        console.error("Error posting data: ", error);
    }
};

// Function to update the UI with the latest entry
const updateUserInterface=async()=>{
    console.log('Updating UI');
    try{
        const request = await fetch('/all');
        const info = await request.json();
        console.log('Latest entry data:', info);
        document.getElementById('date').innerHTML = `Date: ${info.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${info.temperature} F`;
        document.getElementById('content').innerHTML = `Feeling: ${info.userResponse}`;
    }catch (error){
        console.error("Error updating UI: ", error);
    }
};
