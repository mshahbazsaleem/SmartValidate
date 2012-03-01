(function($) {
    $.fn.extend({
        ccvalidate: function(options) {
            var settings = $.extend({
                onvalidate: null
            }, options);
            var cards = new Array();
            cards[0] = { name: "mcd", clength: [16], exp: /^5[1-5]/ };
            cards[1] = { name: "vis", clength: [13, 16], exp: /^4/ };
            cards[2] = { name: "amx", clength: [15], exp: /^3(4|7)/ };
            cards[3] = { name: "dnr", clength: [14], exp: /^3[0,6,8]\d{12}/ };
            cards[4] = { name: "dis", clength: [16], exp: /^6011\d{4}\d{4}\d{4}/ };
            return this.each(function() {
                var type = $(this).find('.cc-ddl-type');
                var cardnumber = $(this).find('.cc-card-number');
                var checkout = $(this).find('.cc-checkout');

                if (type == null || type == undefined)
                    alert('Type Drop Down List not supplied');
                if (cardnumber == null || cardnumber == undefined)
                    alert('Card Number Text Box not supplied');
                if (checkout == null || checkout == undefined)
                    alert('Checkout button not supplied');

                if (type != null && type != undefined &&
                    cardnumber != null && cardnumber != undefined &&
                    checkout != null && checkout != undefined) {

                    $(checkout).click(function() {
                        return ValidateCreditCard(cardnumber.val(), type.val());
                    });
                }
                function ValidateCreditCard(cardNumber, cardType) {
                    var isValid = false;
                    var ccCheckRegExp = /[^\d ]/;
                    isValid = !ccCheckRegExp.test(cardNumber);
                    if (isValid) {
                        var cardNumbersOnly = cardNumber.replace(/ /g, ""); //trim spaces
                        var cardNumberLength = cardNumbersOnly.length;
                        var lengthIsValid = false;
                        var prefixIsValid = false;
                        var prefixRegExp;
                        var card = getCardType(cardType);
                        if (card != null) {
                            for (i = 0; i < card.clength.length; i++) {
                                if (!lengthIsValid) {
                                    if (cardNumberLength == card.clength[i]) lengthIsValid = true;
                                }
                            }
                            prefixIsValid = card.exp.test(cardNumbersOnly);
                        }
                        isValid = prefixIsValid && lengthIsValid;
                    }
                    if (isValid) {
                        var checkSumTotal = 0;
                        checkSumTotal = computeChecksum(cardNumbersOnly);
                        isValid = (checkSumTotal % 10 == 0);
                    }
                    if (settings.onvalidate != null)
                        settings.onvalidate(isValid);
                    return isValid;
                }
                function getCardType(type) {
                    var card = null; ;
                    for (i = 0; i < cards.length; i++) {
                        if (cards[i].name.toLowerCase() == type.toLowerCase()) {
                            card = cards[i];
                            break;
                        }
                    }
                    return card;
                }
                function computeChecksum(cardNo) {
                    var checksum = 0;
                    var factor = 1;
                    var temp;
                    for (i = cardNo.length - 1; i >= 0; i--) {
                        temp = Number(cardNo.charAt(i)) * factor;
                        if (temp > 9) {
                            checksum += 1;
                            temp -= 10;
                        }
                        checksum += temp;
                        factor = (factor == 1 ? 2 : 1);
                    }
                    return checksum;
                }
            });
        }
    });
})(jQuery);