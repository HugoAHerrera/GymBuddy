/*
Archivo para calcular el porcentage de la barra de progreso y las recompensas
en funcion de la meta:

BARRA DE PROGRESO: 0 - 100
    Aumento de la barra de progreso -> en funcion de la cantidad de ejercicios / sets que hay en la meta

    Ejemplo practico:

    Meta con 7 ejercicios, 4 de los ejercicios son de 4 sets y los demas de 3 sets.
    La barra de progreso avanzaria entonces asi:
        - Por cada ejercicio realizado -> aumenta un 1/7
        - Por cada set realizado -> aumenta 1/25

RECOMPENSAS:

    - Por establecer la cantidad de KG por ejercicio / set propuesto -> se calcula en base a la cantidad final la recompensa

 */