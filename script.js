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
  
function prinResult(data){

    var source = $('#templateinfofilm').html();
    var template = Handlebars.compile(source);

    var context = {
        movie: data.id,
        image: controlimgnull(data.poster_path),
        titolo: data.title,
        titoloorig: data.original_title,
        lingua: data.original_language,
        overview: data.overview
    };

    var html = template(context);
    
    $('.wrapper').append(html);
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
        console.log("data getgenrearra", el, genere_val);

        var arr_genre = el.genre_ids;
        console.log("data genere", arr_genre,Number(genere_val));
        console.log("includes", arr_genre.includes(Number(genere_val)));
        
        
        if (arr_genre.includes(Number(genere_val))) {
            
            prinResult(el);
                
        }
        
    }
   
              
}


function getData(pag_n,url,apiKey){

    var query = $('#query_search').val();

    var page_forapi = 1;
    

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
            var total_pages = data.total_pages;
            
            $('.copertina').remove();
            printConsolenavPages(data.page);


            /* var genere_val = 53; */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                prinResult(el);
            }

            $(document).on("click", "#search", function(){

                var query = $('#query_search').val();
                genere_val = $('#genere_select').val();
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

    var page_counter = 1;
   

    $(document).on("keypress", "#query_search", function(event){

        if (event.which === 13) {

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
