{% load i18n %}

{% blocktrans with title=content.title|safe %}

Félicitations&nbsp;!

Je viens de promouvoir le billet « [{{ title }}]({{ url }}) » en article&nbsp;!

Il est en validation et sera examiné prochainement.

À bientôt&nbsp;!
{% endblocktrans %}
