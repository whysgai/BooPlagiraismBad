package com.javacodeexamples.stringexamples;

public class StringCheckIfUpperCaseExample {
    public static void main(String[] args) {
        String str = "UPPERCASESTRING";
        System.out.println( "Is String uppercase?: " + isStringUpperCase(str) );
    }

    private static boolean isStringUpperCase(String str){

        char[] charArray = str.toCharArray();

        for(int i=0; i < charArray.length; i++){

        if( !Character.isUpperCase( charArray[i] ))
            return false;
        }
        return true;
    }
}