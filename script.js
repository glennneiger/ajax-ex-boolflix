function createArray20Results(data, genere_val){

    
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

function prinResultGenres(data){

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

function apiforNextpage (page, url, apiKey, query){

    $.ajax({

        url: url,
        method: "GET",
        data: { query: query,
            language: "it-IT",
            api_key: apiKey,
            page: page }, 

        success: function(data){

            var results = data.results;

            console.log(data.results, data.page);
            
            $('.copertina').remove();
            /* var genere_val = 53; */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                
                prinResult(el);
            }
            
            
        },
        error: function(){
            console.log("errore chiamata per tutte le altre pagine");
            
        }

    });
        
    
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

            var result_on_page = $('.copertina');
            var myArr = [];
            var results = data.results;
            var print_for_genres = getGenreArray(results, genere_val);

            console.log("Api for genre filter",results,"page", data.page, "total_page", data.total_pages);
    
            console.log("genre arr print",print_for_genres, print_for_genres.length);
            
            for (let i = 0; i < print_for_genres.length; i++) {
                const element = print_for_genres[i];

                /* prinResult(element); */

                myArr.push(element);
                console.log("result on page",result_on_page ,(result_on_page.length < 20));
                
                if (result_on_page.length < 20) {
                    prinResult(element);
                }
                
                
                
            }
            
             console.log('genre arr print arr', myArr);
                
            
            
        },
        error: function(error){
            console.log("errore chiamata per tutte le altre pagine");
            
        }

    });
 

}

function getGenreArray(data, genere_val) {
    
    var arr_el = []; 


    for (let j = 0; j < data.length; j++) {
        const el = data[j];
        console.log("data getgenrearra", el, genere_val);

        var arr_genre = el.genre_ids;
        console.log("data genere", arr_genre,Number(genere_val));
        console.log("includes", arr_genre.includes(Number(genere_val)));
        
        
        if (arr_genre.includes(Number(genere_val))) {
            
            arr_el.push(el);
                
        }
        
    }
    
    return arr_el 
              
}


function getData(pag_n,url,apiKey){


    var query = "casa";

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
            var genere_val;
            var page = 1;
            var page_forapi = 1;
            var total_pages = data.total_pages;
            

            /* var genere_val = 53; */
            for (let i = 0; i < results.length; i++) {
                var el =results[i];
                prinResult(el);
            }


           $(document).on("click", "#next", function(){

            page++;
            console.log("click");
            
            
            apiforNextpage (page, url, apiKey, query)

           });

           $(document).on("click", "#search", function(){

                genere_val = $('#genere_select').val();
                $('.copertina').remove();
                for (let i = 0; i < total_pages; i++) {
                    page_forapi++
                    apiForGenereFilter(page_forapi, url, apiKey, query,genere_val)
                    page_forapi = 0;
                }

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

    getData(1,url, apiKey)
}

$(document).ready(init);
