{% load i18n %}

{% blocktrans with title=content.title|safe %}

Bonjour les agrumes&nbsp;!

La bêta a été mise à jour et décante sa pulpe 
à l'adresse suivante&nbsp;:

-> [{{ title}}]({{ url }}) <-

Merci d'avance pour vos commentaires.

{%  endblocktrans %}

