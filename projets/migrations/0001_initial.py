# Generated by Django 5.1.6 on 2025-02-18 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Projet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('date_creation', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
