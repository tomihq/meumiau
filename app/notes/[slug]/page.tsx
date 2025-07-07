// src/app/notes/[slug]/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Tag, Code as CodeIcon } from "lucide-react" // Renamed Code to CodeIcon to avoid conflict
import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSX } from "react"
import { KaTeXRenderer } from "@/components/katex-renderer"
import Image from "next/image"; // Import Image for the markdown content

export const dynamic = "force-static";

// Your sampleNotes array (assuming it's exactly as you provided, with backticks for code blocks)
const sampleNotes = [
  {
    id: 1,
    slug: "c-plus-plus-basics",
    title: "C++ Basics",
    category: "programming",
    tags: ["cpp", "programming-basics", "compilers", "types", "control-flow"],
    date: "2024-07-22",
    content: `Se asume que antes de leer esto, tiene conocimiento básico de programación y algo de Inglés pues algunos términos no tienen una referencia directa a Español.

<h2>Compilador</h2>
C++ es un lenguaje que utiliza un compilador por detrás. Es decir, cuando nosotros necesitamos ejecutar un programa, antes de hacer esto, lo ensambla pasándolo a binario y luego ejecuta la versión .exe generada por el compilador.

<b> Errores que captura el compilador </b>
<ul>
    <li> Syntax Errors: El programador tuvo un error gramático. Ej.: Olvidarse del punto y coma. </li>
    <li> Type Errors: Errores de tipo, se dan cuando queremos hacer una operación a un tipo que no es el correcto. Ej.: Asignar un número a un char.</li>
    <li> Declaration Errors: Todo nombre utilizado debe ser declarado antes. Ej.: Usar una función con nombre que todavía no fue definida.</li>
</ul>



<h2> Convención de nombre de los archivos</h2>
El código a ejecutar debe estar en uno o más archivos diferentes. Los archivos del programa son conocidos como archivos fuente o <b> source files</b>.

El sufijo que indica que un archivo es de C++ es .cpp, .cp, .cxx, .cc y .C
<h2>Instrucciones </h2>
Se finalizan con un <b>;</b>
<h2>Funciones</h2>
La estructura es tipoRetorno nombre(parametros)&#123;codigo&#125;
La palabra clave de retornar algo de un tipo específico es la instrucción <b>return</b>.

<b>Si el tipoRetorno es void, no hace falta utilizar un return. </b>

<h3> Función main </h3>
Siempre retorna un int. En la mayoría de los sistemas, el valor retornado en main es un indicador de estados. 
<ul>
    <li>Retorno = 0: El proceso fue exitoso.</li>
    <li> Retorno != 0: El proceso tuvo algún tipo de error.</li>
</ul>

<h2> Librerías </h2>
Para cargar librerías en nuestros source files utilizamos la palabra reservada include.

Ej.: 
\`\`\`cpp
#include <iostream>

<>: Angle Brackets
\`\`\`
Las librerías siempre deben importarse al inicio del archivo.
<h2> Librería de Entrada y Salida de Datos (IO)</h2>
IO: Input / Output.

La librería se llama <b> iostream</b>. Llamamos stream a una secuencia de caracteres que leemos o fue escrita desde un dispositivo IO. La convención de decirle <b>stream</b> viene de que los caracteres son generados y consumidos secuencialmente durante el tiempo.
<ul>
    <li> cin (se pronuncia see-in): Permite ingresar información. </li>
    <li> cout (se pronuncia see-out): Permite mostrar información.</li>
    <li> cerr (se pronuncia see-err): Lo utilizamos cuando hay un error estándar como una advertencia o error grave. </li>
    <li> clog (se pronuncia see-log): Lo utilizamos para mostrar información general sobre la ejecución del programa. </li>
</ul>

<b>Importante</b>: iostream es una abreviación de input y output stream, pero es posible que en algunos lugares se los mencione como istream (input stream) y ostream (output stream).

Veamos un ejemplo para sumar dos números e imprimirlos en consola
\`\`\`cpp
#include <iostream>

int main() 
{
	std::cout << "Enter Two Numbers:" << std::endl;
	int v1 = 0, v2 = 0;
	std::cin >> v1 >> v2;
	std::cout << "La suma de los dos numeros es:" << v1 + v2 << std::endl;
	
	return 0;
}
\`\`\`

<h3> Header </h3>
Un Header es el nombre que se encuentra dentro de los <b> angle brackets </b> 

<h3> Operators </h3>
<ul>
    <li> \`<<\`: Permite mostrar en pantalla. Toma dos operandos: El de la izquierda tiene que ser un objeto <b> ostream </b>, en el operando de la izquierda es donde se devuelve el resultado. El de la derecha es el valor a mostrar. </li>
    <li> \`>>\`: Permite dejar al usuario enviar información. Toma dos operandos: El de la izquierda es un <b>istream</b>, en el operando de la izquierda es donde se devuelve el resultado. El de la derecha es un objeto.</li>
</ul>

<b>Importante</b>: Si en una línea aparece más de un \`<<\` o \`>>\` entonces, se dividen en operaciones atómicas.
\`\`\`cpp
#include <iostream>

int main() 
{
	std::cin >> v1 >> v2; // Added semicolon for correctness

    // equivale a 
    // (std::cin >> v1) >> v2

    // que a su vez equivale a 
    // std::cin >> v1;
    // std::cin >> v2;
    return 0; // Added return for completeness
}
\`\`\`

<h3> Manipulator </h3>
endl: Tiene el efecto de terminar la ejecución de la línea actual y limpiando el <b> buffer </b> asociado a ese dispositivo.

<b>Importante</b>: Los programadores suelen agregar print mientras debuggean. Esas instrucciones siempre deben limpiar el stream. Caso contrario, si el programa crashea la salida puede haber quedado en el buffer llevándonos a inferencias incorrectas sobre por qué el programa crasheó.

<h3> Namespaces </h3>
Nos permiten evitar colisiones con los nombres que definimos y los usos de esos mismos nombres dentro de una biblioteca. 
\`\`\`cpp
namespace::funcion
\`\`\`

<h2> Comentarios </h2>
//: Comentario de línea

/* */: Comentario de bloque

\`\`\`cpp
//Esto es un comentario

// o

/*
 *  Hola esto es un comentario
 *  pero con múltiples líneas.
*/
\`\`\`
<b> Importante</b>: No es posible meter un comentario dentro de otro.

<h2> Estructuras de Control </h2>
Antes de explicar cualquier estructura de control es necesario entender para qué sirve el operador == en C++.

El operador de == indica la comparación por valor, y devuelve un valor booleano true o false. 

<h3> While </h3>
\`\`\`cpp
    while(condition) {
        statement
    }
\`\`\`
Ej de uso: 
\`\`\`cpp
   int found = 0;
   int i = 0; 
   while(found == 0 && i!=10) {
        if(found){ // This 'if' looks always false unless 'found' changes inside
            found = 1;
        }
        ++i;
   }
\`\`\`
<b>Importante</b>: Recuerde verificar que el while es correcto y efectivamente termina.

<b>Nota</b>: \`++i\` equivale a decir \`i = i+1;\`

<h3> For </h3>
\`\`\`cpp
    for(variable; limite; ++variable) {
        statement
    }
\`\`\`
Ej de uso con una suma de gauss ineficiente:
\`\`\`cpp
    int sum = 0;
    for(int i = 0; i<10; ++i) {
        sum += i;
    }
\`\`\`

<h2> Leyendo una desconocida cantidad de entradas </h2>
Utilizamos un while con un std::cin. El ingreso de información finaliza cuando llegamos a un <b>end-of-file</b> o encontramos un input que no es del tipo que esperamos.

En Windows, ejecutamos el <b> end-of-file</b> presionando CTRL + Z (en la terminal se mostrará ^Z) y luego, enter.

En sistemas UNIX, incluyendo Mac OS X es usualmente control-d.
Ej.: 
\`\`\`cpp
    int value = 0, sum = 0;  
    while(std::cin >> value){
        sum+=value;
    }
    std::cout << "La suma de los numeros ingresados es " << sum << std::endl;
\`\`\`

<h2> Estructuras para Control de Flujo </h2>
<h3> If, Else If, Else </h3>
Es la estructura de control de flujo más común. 
El If/Else If llevan una guarda que indica cuando debe ejecutarse mientras que el Else se ejecuta cuando no sucede ni el if ni el else if.

<b> Importante</b>: Si sabemos que los casos no pueden pasar a la vez, es mejor utilizar un if else que if's separados pues los if se evalúan siempre.

<b> Good To Know</b>: No es necesario que un if tenga un else.

Ej.: 
\`\`\`cpp
    int value = 0;
    if(value == 0){
        std::cout << "Hola, desde el if";
    }else if(value == 1){
        std::cout << "Hola, desde el else if";
    }else{
        std::cout << "Hola desde el else";
    }

    // En este caso, entrará al if pues value = 0.
    // Si value fuese uno, entraría al else if.
    // Si value no es ni 0, ni 1, entonces entra al else.
\`\`\`

<h2> Clases </h2>
Definimos nuestras estructuras de datos usando clases. Una clase define un tipo con una colección de operaciones relacionadas con ese tipo.

Un enfoque principal del diseño de C++ es hacer posible definir tipos de clases que se comporten tan naturalmente como los de los tipos incorporados.

Las clases, las definimos en un header. El sufijo para los archivos de headers es .h pero algunos programadores prefieren .H, .hpp o .hxx. Si bien el compilador no le importa la forma de los nombres de los headers, los IDE si le dan importancia.

<b> Importante </b>: Para usar una clase no necesito saber cómo está implementada sino solamente qué operaciones tiene y cómo las tengo que usar (un TAD, guiño guiño).

Cada clase define un tipo, el nombre del tipo es el mismo que el nombre de la clase.

<h2> Tipos </h2>
<h3> Pasaje por copia o referencia en C++ </h3>
Todos los tipos en C++ se pasan por copia (valor). Sin embargo, hay dos formas de mandarlo por referencia. 

Consideremos una funcion que recibe un parámetro <b> n </b> de cualquier tipo.
<ul> 
    <li> <b>*n</b>: Dirección de memoria de n.  </li>
    <li> <b>&n</b>: Valor de alias al objeto n original. </li>
     <li> <b>n</b>: Copia de n. </li>
</ul>
Veamos ahora sí unos ejemplos

<b> Pasaje por defecto (la función obtiene copia/valor): </b>
\`\`\`cpp
    int haceAlgo(int n) {
        n = 5; //n solo cambia en el ámbito de la función. No cambió en main.
        return 0; 
    }

    int main(){
        int n = 4;
        haceAlgo(n);
        return 0;
    }

    // En este caso, n pasa por copia/valor.
\`\`\`
<b> Pasaje por referencia (la función obtiene directamente el objeto original) </b>
\`\`\`cpp
    int haceAlgo(int& n) { //Llega alias del objeto original.
        n = 5; //Cambió n de main.
        return 0; 
    }

    int main(){
        int n = 4;
        haceAlgo(n); //Pasa referencia de n.
        return 0;
    }
\`\`\`
Cuando en la función recibimos la referencia (&), tenemos solamente el objeto. <b>No tenemos que preocuparnos por posibles valores null.</b>

<b> Pasaje por referencia usando punteros (la función obtiene la dirección donde está el objeto original) </b>
\`\`\`cpp
    int haceAlgo(int* memo) { //Llega puntero de la memoria.
        *memo = 5; //Cambió n de main.
        return 0; 
    }

    int main(){
        int n = 4; 
        haceAlgo(&n); //Envía referencia de la variable.
        return 0;
    }
\`\`\`
Cuando en la función recibimos el puntero (*), tenemos más que el objeto original para modificar. <b>Tenemos que preocuparnos por posibles valores null.</b>

<b> ¿Qué tengo que usar? </b> \`&\` vs \`*\`  
<ul>
    <li> Sintaxis: Con * si se quiere obtener el valor hay que usar <b>*a</b> mientras que si usamos directamente la referencia, podemos hablar de <b> a </b>.</li>
    <li>Uso: Con * pasamos la dirección de memoria, útil para arrays, por otro lado, & es más seguro ya que no puede ser nulo.  </li>
    <li>Seguridad: Con * tenemos que tener cuidado con el nulo o que apunten a una posición de memoria válida, por otro lado, & es más seguro ya que las referencias siempre refieren a un objeto válido. </li>
</ul>
<b> Conclusión </b>: A menos que necesite manejar mucho la memoria a bajo nivel, utilice \`&\`.

<h3> Importancia de los tipos </h3>
Los tipos determinan el significado de la información y las operaciones en nuestros programas.

<h3> Tipos Primitivos en C++ (Built-in Types)</h3>
<Image
  alt={\`Tipos Primitivos en C++\`}
  src={\`/assets/built_in_types.png\`}
  className='rounded-none'
  width={600}
  height={120}
/>
<ul>
    <li> El tipo bool representa los valores de verdad true o false. </li>
    <li> El char tiene el mismo tamaño que un solo byte de máquina.</li>
    <li> Los tipos <b> wchar_t </b>, <b> char16_t </b> y <b> char32_t </b> son usados para sets de caracteres extendidos. La intención de uso de <b> char16_t y char32_t </b> es usarlos para caracteres unicode.</li>
    <li> El tipo <b> int </b> será al menos tan grande como el tipo <b> short </b>.</li>
    <li> El tipo <b> long </b> será al menos tan grande como el tipo <b> int.</b> </li>
    <li>El tipo <b> long long </b> será al menos tan grande como long. </li>
    <li> El tipo <b> float </b> representa números de una palabra (32 bits). </li>
    <li> El tipo <b> double </b> representa números de dos palabras (64 bits). </li>
    <li> El tipo <b> long doubles </b> representa números de tres o cuatro palabras (96 o 128 bits). </li>
</ul>

<h4> Tipos Con Signo y Sin Signo (Signed & Unsigned Types) </h4>
Recordemos que al igual que en diferentes arquitecturas como por ejemplo Risc-V, la representación en sin signo solo representa números positivos (ocupando todos los bits disponibles) mientras que en la representación con signo representa tanto números positivos como negativos (tomando el primer bit como el signo).

<h5> Números </h5>
Los tipos <b> int, short, long y long long </b> son <b> signed</b>. Para poder tratarlos como tipos sin signo, tenemos que agregar antes del tipo la palabra <b> unsigned </b>.

\`\`\`cpp
    int main() {
        unsigned int edad = 0; 
        return 0; // Added return for completeness
    }
\`\`\`
<h5> Caracteres </h5>
Existen tres tipos diferentes: <b> char, signed char y unsigned char</b>.
<ul>
    <li> char: no es lo mismo que signed char. Sin embargo, solo existen las representaciones de signed char y unsigned char. La que se asigne al tipo char depende del compilador. </li>
    <li> unsigned char: toma valores del 0 al 255 inclusive si fuese de 8 bits.  </li>
    <li> signed char: toma valores del -128 al 127 si fuese de 8 bits. </li>
</ul>

<h5> Optimización con los tipos en C++ </h5>
<ol>
    <li> Usá tipos <b> unsigned </b> si sabés que los valores no pueden ser negativos. </li>
    <li> Usá <b> int </b> para cualquier tipo de entero. <b> short </b> suele ser muy chico, y en la práctica <b> long </b> tiene el mismo tamaño que <b> int </b>. Si int no es suficiente, usar <b> long long </b>. </li>
    <li> No utilizar <b> char </b> o <b> bool </b> en expresiones aritméticas. Solamente usarlas para almacenar caracteres o valores de verdad. Utilizar caracteres son muy problemáticos porque algunas computadoras los toman como <b> signed </b> y otras como <b> unsigned </b>. </li>
    <li> Para cálculos muy precisos, utilizar el tipo <b> double</b> en vez de <b> float </b>. Es más, algunas computadoras funcionan más rápido calculando en double que en float.</li>
</ol>

<h3> Conversion de Tipos </h3>
Suceden automáticamente cuando usamos un objeto de un tipo donde se está esperando un objeto de otro tipo. En C++ algunos tipos están relacionados con otros. Dos tipos están relacionados cuando hay una conversión entre ellos.

<h4> Conversiones Implícitas </h4>
Suceden sin el conocimiento del programador. Es decir, la hace C++ a través del compilador.

La mayoría de conversiones tratan de mantener a precisión si es posible. 

Las conversiones implícitas ocurren cuando
<ol>
    <li> En las guardas, las expresiones <b>nonbool</b> se convierten a <b>bool</b>.</li>
    <li>En las inicializaciones, las variables ocurren con el tipo que se le colocó; En asignaciones, el valor que se le quiere asignar se convierte al tipo de la izquierda.</li>
    <ul>
        <li> int i -> i es de tipo int</li>
        <li> int i = 4.1523 -> 4 </li>
    </ul>
    <li>En expresiones aritméticas y expresiones relacionales con operandos de tipos mixtos, los tipos se convierten a un tipo común.</li>
</ol>
<h4> Conversiones Aritméticas</h4>
<h4> Asignar un tipo aritmético a otro</h4>
<ul> 
    <li> bool b = 42 -> b tiene el valor de true </li>
    <li> int i = b; -> i tiene el valor de 1 (true es 1 en int, false es 0 en int) </li>
    <li> i = 3.14 -> i tiene el valor de 3 (porque i es int)</li>
    <li> double pi = i; -> pi tiene el valor de 3.0</li>
    <li> unsigned char c = -1 -> c tiene el valor de 255</li>
    <li> signed char c2 = 256; -> el valor de c2 es undefined pues 256 está fuera de rango</li>
</ul>`,
  },
  {
    id: 2,
    slug: "gradiente-descendente-ml",
    title: "Gradiente Descendente en ML",
    category: "mathematics",
    tags: ["calculus", "ml", "optimization"],
    date: "2024-01-15",
    content: `# Gradiente Descendente en Machine Learning

El **gradiente descendente** es el algoritmo fundamental para optimizar funciones de costo en machine learning.

## La Fórmula Principal

$$\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)$$

Donde $\\alpha$ es la tasa de aprendizaje y $\\nabla J(\\theta_t)$ es el gradiente.

## Función de Costo Cuadrática

Para regresión lineal, minimizamos:

$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$

Su gradiente es:

$$\\frac{\\partial J}{\\partial \\theta_j} = \\frac{1}{m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)}) x_j^{(i)}$$

## Tipos de Gradiente Descendente

### Batch Gradient Descent
Usa todo el dataset: $\\theta = \\theta - \\alpha \\nabla J(\\theta)$

### Stochastic Gradient Descent  
Una muestra a la vez: $\\theta = \\theta - \\alpha \\nabla J_i(\\theta)$

### Mini-batch
Combina ambos enfoques con lotes de tamaño $b$.

¡Simple pero poderoso! 🚀`,
  },
];

// Componente para renderizar contenido con Markdown y KaTeX
function MarkdownWithKaTeX({ content }: { content: string }) {
  // Regex for block math (double dollar signs)
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
  // Regex for inline math (single dollar signs)
  const inlineMathRegex = /\$([^$\n]+?)\$/g;
  // Regex for image markdown: ![alt text](src)
  const imageMarkdownRegex = /!\[(.*?)\]\((.*?)\)/g;

  const processTextForMathAndMarkdown = (text: string) => {
    const parts: Array<JSX.Element | string> = [];
    let lastIndex = 0;

    // Combined regex to capture all: block math, inline math, image markdown
    const combinedRegex = new RegExp(
      `${blockMathRegex.source}|${inlineMathRegex.source}|${imageMarkdownRegex.source}`,
      'g',
    );

    let match;
    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the current match
      if (match.index > lastIndex) {
        parts.push(processInlineMarkdown(text.slice(lastIndex, match.index)));
      }

      // Handle the match
      if (match[1] !== undefined) { // Block Math ($$content$$) -> match[1] is the content
        parts.push(<KaTeXRenderer key={lastIndex} math={match[1]} block />);
      } else if (match[2] !== undefined) { // Inline Math ($content$) -> match[2] is the content
        parts.push(<KaTeXRenderer key={lastIndex} math={match[2]} />);
      } else if (match[3] !== undefined && match[4] !== undefined) { // Image Markdown ![alt](src) -> match[3]=alt, match[4]=src
        parts.push(
          <Image
            key={lastIndex}
            alt={match[3]}
            src={match[4]}
            width={0} // These need to be actual numbers
            height={0} // or you'll get a warning. Use fill or provide width/height.
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }} // Responsive styling
            className="my-4 rounded-lg shadow-lg"
          />
        );
      }
      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(processInlineMarkdown(text.slice(lastIndex)));
    }

    return <>{parts}</>;
  };

  const processInlineMarkdown = (text: string) => {
    // Process markdown for strong, italic, and inline code
    return text
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-green-400 font-mono text-sm">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-purple-200 italic">$1</em>')
      .replace(/<br\s*\/?>/g, '') // Remove <br/> tags to avoid issues with newlines
  };

  const renderContent = () => {
    const elements: JSX.Element[] = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-purple-300 mt-6 mb-3">{line.substring(4)}</h3>);
        i++;
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-purple-300 mt-8 mb-4">{line.substring(3)}</h2>);
        i++;
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-3xl font-bold text-white mb-6 mt-8">{line.substring(2)}</h1>);
        i++;
      }
      // HTML Headers (your content has these)
      else if (line.startsWith('<h2>')) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.replace('<h2>', '').replace('</h2>', '').trim()}</h2>);
        i++;
      } else if (line.startsWith('<h3>')) {
        elements.push(<h3 key={i} className="text-xl font-semibold text-purple-300 mt-6 mb-3">{line.replace('<h3>', '').replace('</h3>', '').trim()}</h3>);
        i++;
      }
      // Unordered Lists
      else if (line.startsWith('<ul>') || line.startsWith('<li>') || line.startsWith('</ul>')) {
        let listItems: string[] = [];
        const isUnorderedList = line.startsWith('<ul>');
        const listTag = isUnorderedList ? 'ul' : 'ol'; // Determine if it's ol or ul
        const ListItemTag = 'li';

        if (isUnorderedList) { // Start of a <ul>
          i++; // Skip <ul> tag
          while (i < lines.length && lines[i].startsWith('<li>')) {
            let itemContent = lines[i].substring(4).replace('</li>', '').trim();
            // Also process B tags here if they are directly in list items
            itemContent = itemContent.replace(/<b>(.*?)<\/b>/g, '<strong class="font-semibold text-white">$1</strong>');
            listItems.push(itemContent);
            i++;
          }
          if (lines[i] && lines[i].startsWith('</ul>')) {
            i++; // Skip </ul> tag
          }
        } else if (line.startsWith('<li>')) { // Handle individual <li> if not part of explicit <ul> block detection
            let itemContent = line.substring(4).replace('</li>', '').trim();
            itemContent = itemContent.replace(/<b>(.*?)<\/b>/g, '<strong class="font-semibold text-white">$1</strong>');
            listItems.push(itemContent);
            i++;
        }

        if (listItems.length > 0) {
          elements.push(
            React.createElement(listTag, { key: elements.length, className: `list-disc list-inside space-y-1 text-gray-300 ml-4 mb-4` }, // Added ml-4 for indentation
              listItems.map((item, idx) =>
                React.createElement(ListItemTag, { key: idx }, processTextForMathAndMarkdown(item))
              )
            )
          );
        } else if (!line.startsWith('<ul>') && !line.startsWith('</ul>')) {
            // If it's not a list tag and no items collected, treat as paragraph for now
            elements.push(<p key={i} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{__html: processInlineMarkdown(line.replace(/<b>(.*?)<\/b>/g, '<strong class="font-semibold text-white">$1</strong>'))}} />);
            i++;
        } else { // It was just an opening/closing list tag without content immediately
            i++;
        }
      }
      // HTML BOLD tag detection at the start of a line (your specific content has this)
      else if (line.startsWith('<b>')) {
        const content = line.replace('<b>', '').replace('</b>', '').trim();
        elements.push(<p key={i} className="text-gray-300 leading-relaxed mb-4"><strong className="font-semibold text-white">{processTextForMathAndMarkdown(content)}</strong></p>);
        i++;
      }
      // Code Blocks
      else if (line.startsWith('```')) {
        const langMatch = line.match(/^```(\S+)?/);
        const language = langMatch ? langMatch[1] : ''; // Capture language, e.g., 'cpp'
        let codeBlockContent: string[] = [];
        i++; // Move past the opening '```'
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeBlockContent.push(lines[i]);
          i++;
        }
        if (lines[i] && lines[i].startsWith('```')) {
          i++; // Move past the closing '```'
        }
        elements.push(
          <pre
            key={elements.length}
            className="bg-slate-800/50 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto my-4 border border-slate-700/50"
          >
            {/* For actual syntax highlighting, you would use a library here: */}
            {/* <SyntaxHighlighter language={language} style={atomOneDark}> */}
            {codeBlockContent.join('\n')}
            {/* </SyntaxHighlighter> */}
          </pre>,
        );
      }
      // Tables
      else if (line.includes('|') && !line.includes('```')) { // Check for pipe char and ensure not in code block
        let tableLines: string[] = [];
        while (i < lines.length && lines[i].includes('|') && !lines[i].includes('```')) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) { // Minimum of header and separator
          const [headerLine, separatorLine, ...dataLines] = tableLines;
          const headers = headerLine.split('|').map(h => h.trim()).filter(h => h !== '');
          const tableRowsData = dataLines.map(row => row.split('|').map(c => c.trim()).filter(c => c !== ''));

          elements.push(
            <div key={elements.length} className="overflow-x-auto my-4">
              <table className="min-w-full border border-slate-700 rounded-lg">
                <thead className="bg-slate-800/50">
                  <tr>
                    {headers.map((header, hIdx) => (
                      <th key={hIdx} className="px-4 py-2 text-left text-purple-300 font-semibold border-b border-slate-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRowsData.map((rowData, rIdx) => (
                    <tr key={rIdx} className="border-b border-slate-700/50">
                      {rowData.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2 text-gray-300">
                          {processTextForMathAndMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } else { // If it looked like a table but wasn't valid, treat as paragraph
          elements.push(<p key={i} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{__html: processInlineMarkdown(line)}} />);
          i++;
        }
      }
      // Blockquotes (example for future expansion, not in your text)
      // else if (line.startsWith('> ')) { ... }
      // Image Markdown (handled within processTextForMathAndMarkdown for inline/paragraph context)

      // Default: Paragraph or blank lines
      else {
        if (line.trim() !== '') {
          // Check for ordered list items. If a line starts with "1. ", "2. ", etc.
          const olMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (olMatch) {
            let listItems: string[] = [];
            const startingIndex = parseInt(olMatch[1]);
            listItems.push(olMatch[2]);
            i++; // Move to the next line

            // Collect consecutive ordered list items
            while (i < lines.length) {
              const nextOlMatch = lines[i].match(/^(\d+)\.\s*(.*)/);
              if (nextOlMatch && parseInt(nextOlMatch[1]) === startingIndex + listItems.length) {
                listItems.push(nextOlMatch[2]);
                i++;
              } else {
                break; // Not a consecutive list item
              }
            }
            elements.push(
                <ol key={elements.length} className="list-decimal list-inside space-y-1 text-gray-300 ml-4 mb-4">
                  {listItems.map((item, idx) => (
                    <li key={idx}>
                      {processTextForMathAndMarkdown(item.replace(/<b>(.*?)<\/b>/g, '<strong class="font-semibold text-white">$1</strong>'))}
                    </li>
                  ))}
                </ol>
            );
            continue; // Continue to the next line after handling the list
          }
          // Handle standard paragraph content, including b tags you provided
          const processedParagraph = line.replace(/<b>(.*?)<\/b>/g, '<strong class="font-semibold text-white">$1</strong>');
          elements.push(<p key={i} className="text-gray-300 leading-relaxed mb-4">{processTextForMathAndMarkdown(processedParagraph)}</p>);
        }
        i++;
      }
    }
    return elements;
  };

  return <div className="prose prose-invert max-w-none">{renderContent()}</div>;
}

export default function NotePage({ params }: { params: { slug: string } }) {
  const note = sampleNotes.find((n) => n.slug === params.slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/notes">
            <Button variant="outline" className="mb-6 mt-16 border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </Link>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{note.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {note.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Render the processed Markdown and KaTeX content */}
              <MarkdownWithKaTeX content={note.content} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}