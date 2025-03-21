# Generated by Django 5.1.6 on 2025-03-06 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utilisateurs', '0003_utilisateur_heure_notification_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='utilisateur',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='utilisateur',
            name='role',
            field=models.CharField(choices=[('ETUDIANT', 'Étudiant'), ('PROFESSEUR', 'Professeur'), ('ADMIN', 'Administrateur')], max_length=20),
        ),
    ]
