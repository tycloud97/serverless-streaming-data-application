const Avatar = require('avatar-builder').default;
const MAX_RACERS = 200

// Generate icons for racers
const fs = require ('fs')

const avatar = Avatar.builder(
    Avatar.Image.margin(Avatar.Image.roundedRectMask(Avatar.Image.compose(
    Avatar.Image.randomFillStyle(),
    Avatar.Image.shadow(Avatar.Image.margin(Avatar.Image.cat(), 8), {blur: 5, offsetX: 2.5, offsetY: -2.5,color:'rgba(0,0,0,0.75)'})
    ), 32), 8),
    128, 128)

const createIcon = (id) => {
    avatar.create(id).then(buffer => fs.writeFileSync(`./icons/${id}.png`, buffer))
}

for (let i = 1; i < MAX_RACERS; i++ )
    createIcon(i)