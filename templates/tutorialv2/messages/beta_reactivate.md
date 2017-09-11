{% load i18n %}

{% blocktrans with title=content.title|safe type=type|safe %}

Oyez oyez les agrumes&nbsp;!

Je vous annonce avec plaisir la ré-ouverture de la bêta du contenu 
« {{ title }} »&nbsp;! Je vous souhaite une agréable lecture à l'adresse 
suivante&nbsp;:

-> [Je suis de retour&nbsp;!]({{ url }}) <-

Merci pour votre participation.

{%  endblocktrans %}
