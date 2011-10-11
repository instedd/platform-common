# Execute from root repository directory
def generate_classes(path, class_prefix, size, samples=false)
    files = Dir.glob("#{path}/*.png")
    files.each do |file|
        name = File.basename(file, '.png')
        imgpath = file.gsub(/^theme/, '..')
        if samples
            puts "<div class='#{class_prefix}-#{name}'></div>"
        else
            puts ".#{class_prefix}-#{name} { background:url(#{imgpath}) no-repeat center top; width:#{size}px; height:#{size}px; display:inline-block }"
        end
    end
end

# Size 18
size = 18
colors = %W(black grey orange white yellow)
colors.each do |color|
    generate_classes("theme/images/icons/#{size}/#{color}", "i18#{color[0]}", size)
end

# Size 48
generate_classes('theme/images/icons/48/gradient', "i48grad", 48)

# Size 72
generate_classes('theme/images/icons/72/grey', "i72g", 72)

# Size 96
generate_classes('theme/images/icons/96/gradient', "i96grad", 96)



