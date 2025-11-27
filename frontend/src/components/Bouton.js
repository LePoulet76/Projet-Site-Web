import React, { useEffect, useRef, useState } from "react";

const Bouton = ({ url, texte }) => {
    return(
        <a href = {url}>
            {texte}
        </a>
    );

};
export default Bouton;