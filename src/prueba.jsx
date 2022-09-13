import { Fragment } from "react";

export default function Prueba(){
    return(
        <Fragment>
            <h1>Hola</h1>
            <div class="bgded overlay padtop" style="background-image:url('/assets/images/demo/backgrounds/01.png');"> 
            <header id="header" class="hoc clear">
                <div id="logo" class="fl_left"> 
                
                <h1><a href="index.html">Nekmit</a></h1>
                
                </div>
                <nav id="mainav" class="fl_right"> 
                
                <ul class="clear">
                    <li class="active"><a href="index.html">Home</a></li>
                    <li><a class="drop" href="#">Pages</a>
                    <ul>
                        <li><a href="pages/gallery.html">Gallery</a></li>
                        <li><a href="pages/full-width.html">Full Width</a></li>
                        <li><a href="pages/sidebar-left.html">Sidebar Left</a></li>
                        <li><a href="pages/sidebar-right.html">Sidebar Right</a></li>
                        <li><a href="pages/basic-grid.html">Basic Grid</a></li>
                        <li><a href="pages/font-icons.html">Font Icons</a></li>
                    </ul>
                    </li>
                    <li><a class="drop" href="#">Dropdown</a>
                    <ul>
                        <li><a href="#">Level 2</a></li>
                        <li><a class="drop" href="#">Level 2 + Drop</a>
                        <ul>
                            <li><a href="#">Level 3</a></li>
                            <li><a href="#">Level 3</a></li>
                            <li><a href="#">Level 3</a></li>
                        </ul>
                        </li>
                        <li><a href="#">Level 2</a></li>
                    </ul>
                    </li>
                    <li><a href="#">Link Text</a></li>
                    <li><a href="#">Link Text</a></li>
                    <li><a href="#">Link Text</a></li>
                </ul>
                </nav>
            </header>
            <div id="pageintro" class="hoc clear"> 
                <article>
                <h3 class="heading">Suspendisse potenti</h3>
                <p>Arcu mi porttitor est non felis aliquam ullamcorper sed porttitor accumsan arcu maecenas lorem elit tristique quis iaculis at euismod vel arcu donec et lorem.</p>
                <footer>
                    <ul class="nospace inline pushright">
                    <li><a class="btn" href="#">Integer</a></li>
                    <li><a class="btn inverse" href="#">Egestas</a></li>
                    </ul>
                </footer>
                </article>
            </div>
            </div> 
        </Fragment>
    )
}