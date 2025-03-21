# Generated by Django 5.1.6 on 2025-02-20 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projets', '0003_projet_date_limite_projet_statut_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='projet',
            name='emoji',
            field=models.CharField(default='📌', max_length=10),
        ),
        migrations.AddField(
            model_name='projet',
            name='heure_rappel',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='projet',
            name='rappel',
            field=models.CharField(choices=[('aucun', 'Aucun'), ('matin', 'Matin (09:00)'), ('midi', 'Midi (12:00)'), ('apresmidi', 'Après-midi (16:00)'), ('soir', 'Soir (19:00)'), ('custom', 'Personnalisé')], default='aucun', max_length=20),
        ),
        migrations.AddField(
            model_name='projet',
            name='theme_couleur',
            field=models.CharField(default='#FFFFFF', max_length=7),
        ),
    ]
