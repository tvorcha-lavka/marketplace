/*global URLify*/
'use strict';
{
    function getSourceLanguageCode(defaultLanguageCode = 'uk') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('language') || defaultLanguageCode;
    }

    function getTargetLanguageCode() {
        return 'en'
    }

    function getDeeplApiKey() {
        const elementId = 'django-admin-prepopulated-fields-constants'
        return document.getElementById(elementId).getAttribute('deepl-api-key');
    }

    async function translate(value) {

        const url = `https://api-free.deepl.com/v2/translate?
            auth_key=${getDeeplApiKey()}&
            text=${encodeURIComponent(value)}&
            source_lang=${getSourceLanguageCode()}&
            target_lang=${getTargetLanguageCode()}`
            .replace(/\s+/g, '');
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.translations && data.translations.length > 0) {
                return data.translations[0].text;
            } else {
                return value;
            }
        } catch (error) {
            return value;
        }

    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const $ = django.jQuery;

    $.fn.prepopulate = function(dependencies, maxLength, allowUnicode) {
        /*
            Depends on urlify.js
            Populates a selected field with the values of the dependent fields,
            URLifies and shortens the string.
            dependencies - array of dependent fields ids
            maxLength - maximum length of the URLify'd string
            allowUnicode - Unicode support of the URLify'd string
        */
        return this.each(function() {
            const prepopulatedField = $(this);
            let previousValue = '';

            const populate = debounce(function() {
                // Если пользователь изменил поле, то выходим
                if (prepopulatedField.data('_changed')) {
                    return;
                }

                const values = [];
                $.each(dependencies, function(i, field) {
                    field = $(field);
                    if (field.val().length > 0) {
                        values.push(field.val());
                    }
                });

                const currentValue = values.join(' ');

                if (!currentValue || currentValue === previousValue) {
                    return;
                }

                previousValue = currentValue;

                (async () => {
                    const translatedValue = await translate(currentValue)
                    prepopulatedField.val(URLify(translatedValue, maxLength, allowUnicode));
                })();
            }, 2000);

            prepopulatedField.data('_changed', false);
            prepopulatedField.on('change', function() {
                prepopulatedField.data('_changed', true);
            });

            if (!prepopulatedField.val()) {
                $(dependencies.join(',')).on('keyup change focus', populate);
            }
        });
    };
}
