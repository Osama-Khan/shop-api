import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as path from 'path';
import { Observable } from 'rxjs';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';

type ImageType = 'user' | 'product';

const USER_WIDTH = 192;
const USER_HEIGHT = 192;
const PROD_WIDTH = 400;

/** Saves Base64 images in request to files and replaces the data with
 * image paths
 */
@Injectable()
export default class SaveImageInterceptor implements NestInterceptor {
  /**
   * @param property name of the property in body that contains image(s)
   * @param type type of the image
   */
  constructor(private property: string, private type: ImageType) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const img = request.body[this.property];

    if (this.type === 'user') {
      request.body[this.property] = generateImage(img, USER_WIDTH, USER_HEIGHT);
    } else {
      request.body[this.property] = img.map((img: string) =>
        generateImage(img, PROD_WIDTH),
      );
    }

    return next.handle();
  }
}

const generateImage = (img: string, width: number, height?: number) => {
  const name = uuid();
  const filePath = `/images/uploads/${name}.jpeg`;

  const parts = img.split(';');
  const imageData = parts[1].split(',')[1];
  const buffer = Buffer.from(imageData, 'base64');

  sharp(buffer)
    .resize({ width, height })
    .toFormat('jpeg')
    .toFile(path.resolve(`public${filePath}`));
  return filePath;
};
