# Generated by Django 5.1.6 on 2025-02-20 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projets', '0004_projet_emoji_projet_heure_rappel_projet_rappel_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projet',
            name='theme_couleur',
        ),
        migrations.AlterField(
            model_name='projet',
            name='emoji',
            field=models.CharField(default='🚀', max_length=10),
        ),
    ]
