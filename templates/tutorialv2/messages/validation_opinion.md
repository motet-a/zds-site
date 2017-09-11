{% load i18n %}


{% blocktrans with title=title|safe validator_name=validator.username|safe validator_url=validator.get_absolute_url message=message_validation|safe %}
Félicitations&nbsp;!

Le billet « [{{ title }}]({{ url }}) » a bien été approuvé par l'équipe du site&nbsp;!
{% endblocktrans %}


{% blocktrans %}
Fêtons-donc ça avec un smoothie&nbsp;!&nbsp;:D
{% endblocktrans %}
