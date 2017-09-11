{% load i18n %}

{% blocktrans with title=content.title|safe %}

Salut&nbsp;!

Je viens de prendre en charge la validation de ton contenu, « [{{ title }}]({{ url }}) ».

À bientôt&nbsp;!

{% endblocktrans %}
