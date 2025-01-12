# Navigation
- [First Step](#first-step)
- [Second Step](#second-step)
- [Third Step](#third-step)
- [Fourth step](#fourth-step)
- [Fifth Step](#fifth-step)

### First Step
get Data from user input 
{
    movieName = "movie"
    cityName = "city"
    language = "language"
}
then get all the movies listed in the city base on user city 
=> use the first API 
### Second Step
in the  second step find movie user want to see 
for all the movies listed in the city
### Third Step
in the third open user movie details page 
=> use the second API
### Fourth Step
### Fifth Step



<!-- ext code  -->
    const url =
      'https://www.facebook.com/tr/?id=895788993886590&ev=SubscribedButtonClick&dl=https%3A%2F%2Fin.bookmyshow.com%2Fsurat%2Fmovies%2Fgame-changer%2FET00311772&rl=https%3A%2F%2Fin.bookmyshow.com%2Fbuytickets%2Fgame-changer-hindi-kolkata%2Fmovie-kolk-ET00407895-MT%2F20250112&if=false&ts=1736666897689&cd[buttonFeatures]={"classList":"sc-8f9mtj-0 sc-8f9mtj-1 sc-1vmod7e-0 bGKFux"}&cd[buttonText]=Book%20tickets&cd[formFeatures]=[]&cd[pageFeatures]={"title":"Game%20Changer%20(2025)%20-%20Movie%20%7C%20Reviews%2C%20Cast%20%26%20Release%20Date%20in%20surat-%20%20BookMyShow"}&sw=1536&sh=864&v=2.9.179&r=stable&ec=2&o=4126&fbp=fb.1.1736063807103.526608478763752515&ler=empty&cdl=API_unavailable&it=1736666832991&coo=false&es=automatic&tm=3&rqm=GET';

    // Create a URL object
    const parsedUrl = new URL(url);

    // Get the 'dl' parameter value
    const dl = parsedUrl;

    const identifier = dl ? dl : null;

    console.log("identifier", identifier); // Outputs: ET00407895-MT