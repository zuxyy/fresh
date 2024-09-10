 
     function fullImageGet_one($thisClickBlock) {

         $findImg = $thisClickBlock.find('img');
         $itemID = $thisClickBlock.attr('item_id')
         $imgObject = {};

         $findImg.each(function (index) {
             //console.log(index + ": " + $(this).attr('src'));
             $imgObject[index] = $(this).attr('image_main');

         });

        

         fullImageGet();
         return $imgObject;

     };



 function fullImageGet() {
     $thisElement = $(event.target);
     $src = $thisElement.attr('image_main');
     if ($src) {
         findBox($src);
         showBlock();
     }

 };

function check_setting() {

    var style = "";

    for (let i = 0; i < gallery_setting_img.length; i++) {
    if (gallery_setting_img[i][$itemID] !== undefined && gallery_setting_img[i][$itemID] !== false ) {
        var style = "object-fit: " + gallery_setting_img[i][$itemID][0];
            return style;
        } else {
            continue;
        }
    }

    return style;
}



 function findBox($src) {

      
   
     $clear = $("#itemContainer").empty();

     $count_image = Object.keys($imgObject).length;

     for ($i = 0; $i < $count_image; $i++) {

         if ($count_image == 1) {

             $("#itemContainer").append("<img src=" + $src + " class=\"gallery_oneImage\">");
             return;
         } else if ($count_image > 1) {
             if ($i == 1) {

                 $("#itemContainer").prepend("<div class=\"gallery_popap_mainImageContainer\"><img style=\"" + check_setting() + "\" class=\"mainIg\" src=" + $src + ">");
                 $i = 2;
             }

             if ($i == 2) {
                 $("#itemContainer").append("<div class=\"itemsContainer\">");

                 for ($b = $i - 2; $b < $count_image; $b++) {

                     if ($src == $imgObject[$b]) {
                         $(".itemsContainer").append("<div class=\"active\" style=\"padding: 0px;\"><img class=\"find\" src=" + $imgObject[$b] + " count=\'" + $b + "\' object_src=\'" + $imgObject[$b] + "\'></div>");
                     } else {
                         $(".itemsContainer").append("<div style=\"padding: 0px;\"><img class=\"find\" src=" + $imgObject[$b] + " count=\'" + $b + "\' object_src=\'" + $imgObject[$b] + "\'></div>");
                     }
                 }
             }
         }
     }

 };






 $("#itemContainer").on("click", "img[class*='find']", function () {


     $count = $(this).attr('count');
     $object_src = $(this).attr('object_src');

     $remouveActive = $('.active').removeClass('active');

     $miniImage = $('[count="' + $count + '"]');
     $addClass = $miniImage.parent().addClass('active');

     $firstImage = $("#itemContainer").find("div:first");

     $firstImageAttr = $("#itemContainer").find("div:first").children();
     $firstImageAttrSrc = $firstImageAttr.attr("src");


     if ($(this).attr('src') == $firstImageAttrSrc) {
         return;
     }

     $animation = $firstImage.fadeOut("slow");
     $animationSeconds = '500';

     function deleteImage() {
         return $firstImage.detach();
     }

     function addImage() {

         $change = $("#itemContainer").prepend("<div class=\"gallery_popap_mainImageContainer\"><img style=\"" + check_setting() + "\" class=\"mainIg\" src=" + $object_src + " >");
         $change.fadeIn("slow");
         return $change;

     }


     function debugClear() {
         $search_elemen = $('#itemContainer').find('.gallery_popap_mainImageContainer');

         if ($search_elemen.length > 1) {

             $find_firstElement = $('#itemContainer').find('.gallery_popap_mainImageContainer').first();
             $delete = $find_firstElement.detach();
             return $delete;

         }
     }


     $deleteImage = setTimeout(deleteImage, $animationSeconds);
     $addImage = setTimeout(addImage, $animationSeconds);
     $debug = setTimeout(debugClear, $animationSeconds);




 });


 function showBlock() {

     $('.box').css('display', 'flex');

 };

 function hiddeBlock() {

     $('.box').css('display', 'none');

 };

 function fullImageClouse() {

     $clickArea = event.target;
     $areaElement = $clickArea.tagName.toLowerCase();

     //            if ($areaElement == 'div') {
     //                hiddeBlock();
     //            }
     // update
     $areaElement = $clickArea.className;
     if ($areaElement == 'box') {
         hiddeBlock();
     }

 };