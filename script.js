function printConsolenavPages(data){

    var source = $('#template_nav_page').html();
    var template = Handlebars.compile(source);

    var context = {
        page: data
    };

    var html = template(context);

    $('#consol_page').html(html);
}

function controlimgnull(imgurl){
    var src = "";
  
    if (imgurl === null){
      src = "img/sorry.jpg"
    }else{
      src = "https://image.tmdb.org/t/p/w342" + imgurl;
    }
    return src
}
  
function prinResult(data, append_to){

    
    var source = $('#templateinfofilm').html();
    var template = Handlebars.compile(source);

    var context = {
        movie: data.id,
        image: controlimgnull(data.poster_path),
        titolo: data.title,
        titoloorig: data.original_title,
        lingua: data.original_language,
        overview: data.overview,
        genere: data.genre_ids
    };

    var html = template(context);

    append_to.append(html);  
}

function apiForGenereFilter(page, url, apiKey, query, genere_val){

    $.ajax({

        url: url,
        method: "GET",
        data: { query: query,
            language: "it-IT",
            api_key: apiKey,
            page: page }, 

        success: function(data){

            var results = data.results;
            getGenreArray(results, genere_val);
            
            
        },
        error: function(error){
            console.log("errore chiamata per tutte le altre pagine");
            
        }

    });
 

}

function getGenreArray(data, genere_val) {
     
    
    for (let j = 0; j < data.length; j++) {

        const el = data[j];
        var arr_genre = el.genre_ids;
       
        console.log("data genere", arr_genre,Number(genere_val));
        console.log("data genere includes", arr_genre.includes(Number(genere_val)));
        
        
        if (arr_genre.includes(Number(genere_val))) {
         
            prinResult(el,$('.wrapper'));
                       
        } 
    }          
    
              
}


function getData(pag_n,url,apiKey){

    var query = $('#query_search').val();

    
    

    $.ajax({
        url: url,
        method: "GET",
        data: { query: query,
                language: "it-IT",
                api_key: apiKey,
                page: pag_n },

        success: function(data){
            console.log(data);
            var results = data.results;
                        
            $('.copertina').remove();
            printConsolenavPages(data.page);


            /* var genere_val = 53; */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                prinResult(el, $('.wrapper'));
            }

            $(document).on('click','#search',function(){
                var query = $('#query_search').val();
                var genere_val = $('#genere_select').val();
                var total_pages = data.total_pages;
                var page_forapi = 1;
                $(document).off("click", "#prev");
                $(document).off("click", "#next");
                 console.log("total_pages", total_pages);
                 $('.copertina').remove();
                for (let i = 0; i < total_pages; i++) {
                    page_forapi++
                    apiForGenereFilter(page_forapi, url, apiKey, query,genere_val)
                    
                }
                page_forapi = 0;

            });
                          
        },
        error: function(err){
            console.log("errore chiamata api");
            
        }
    });
}


function init() {
    var url = "https://api.themoviedb.org/3/search/movie?&language=it-IT";
    var apiKey = "ad43da61407cf7dd84ab0c94302e0c68";

    var page_counter = 0;
    
    

    $(document).on("keypress", "#query_search", function(event){

        if (event.which === 13) {

            page_counter = 1;

            getData (page_counter, url, apiKey);
        }
    });

    
    $(document).on("click", "#next", function(){

        page_counter++;
        
        getData (page_counter, url, apiKey);

    });

    
    $(document).on("click", "#prev", function(){

        page_counter--;
        
        getData (page_counter, url, apiKey);

    });

    
    
}

$(document).ready(init);