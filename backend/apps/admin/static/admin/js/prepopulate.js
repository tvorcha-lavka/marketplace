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

    let defaultUrlField = ''

    function setUrlFieldValue(value) {
        const slugField = $('#id_slug');
        const urlField = $('#id_url');

        if (urlField) {
            if (!defaultUrlField) {
                defaultUrlField = urlField.val()
            }

            if (!slugField.val()) {
                urlField.val(defaultUrlField)
            }
            let lastSlashIndex = defaultUrlField.lastIndexOf('/');
            let newUrl;

            if (lastSlashIndex !== 6) {
                newUrl = defaultUrlField.slice(0, lastSlashIndex);
            } else {
                newUrl = defaultUrlField;
            }

            urlField.val(`${newUrl}/${value}`);
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
            const prepopulatedFieldId = prepopulatedField.get(0).id

            let previousValue = '';
            let awaitValue = 0;

            if (prepopulatedFieldId === 'id_slug') {
                awaitValue = 1500
            }

            const populate = debounce(function() {
                // Bail if the field's value has been changed by the user
                if (prepopulatedField.data('_changed')) {
                    return;
                }

                let prepopulatedFieldID = prepopulatedField.get(0).id;
                let translatableForm = false

                const values = [];

                $.each(dependencies, function(i, field) {
                    field = $(field);

                    const fieldValue = field.val();
                    if (fieldValue.length > 0) {
                        values.push(fieldValue);
                    }

                    if (!translatableForm) {
                        const formElement = field.get(0).form;
                        if (formElement && formElement.querySelector('div[class="parler-language-tabs"]')) {
                            translatableForm = true;
                        }
                    }
                });

                let currentValue = values.join(' ');

                if (prepopulatedFieldID === 'id_slug' && translatableForm) {
                    if (!currentValue || currentValue === previousValue) {
                        return;
                    }
                    previousValue = currentValue;

                    (async () => {
                        const translatableValue = await translate(currentValue)
                        const sluggedFieldValue = URLify(translatableValue, maxLength, allowUnicode);
                        prepopulatedField.val(sluggedFieldValue);
                        setUrlFieldValue(sluggedFieldValue)
                    })();
                } else if (prepopulatedFieldID === 'id_url') {
                    const sluggedFieldValue = URLify(currentValue, maxLength, allowUnicode);
                    setUrlFieldValue(sluggedFieldValue)
                } else {
                    prepopulatedField.val(URLify(currentValue, maxLength, allowUnicode));
                }
            }, awaitValue);

            prepopulatedField.data('_changed', false);
            prepopulatedField.on('change', function() {
                prepopulatedField.data('_changed', true);
            });
            if (!prepopulatedField.val() || prepopulatedFieldId === 'id_url') {
                $(dependencies.join(',')).on('keyup change focus', populate);
            }
        });
    };
}
